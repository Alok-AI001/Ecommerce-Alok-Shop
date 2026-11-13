
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.views.generic import View
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_text

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Product, Order, OrderItem, ShippingAddress
from .serializer import (
    ProductSerializer,
    UserSerializerWithToken,
    OrderSerializer,
    UserSerializer
)
from .utils import generate_token


# =========================
# API ROUTES
# =========================

@api_view(['GET'])
def getRoutes(request):
    return Response([
        {
            "products": request.build_absolute_uri("/api/products/"),
            "product": request.build_absolute_uri("/api/product/1/"),
            "login": request.build_absolute_uri("/api/users/login/"),
            "signup": request.build_absolute_uri("/api/users/register/"),
        }
    ])


# =========================
# PRODUCTS
# =========================

@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response(
            {"details": "Product not found"},
            status=status.HTTP_404_NOT_FOUND
        )


# =========================
# LOGIN / JWT TOKEN
# =========================

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        data.update(serializer)
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# =========================
# SIGNUP
# =========================

@api_view(['POST'])
def registerUser(request):
    data = request.data

    fname = data.get('fname', '').strip()
    lname = data.get('lname', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not fname or not lname or not email or not password:
        return Response(
            {'details': 'Please fill all fields'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if '@' not in email or '.' not in email.split('@')[-1]:
        return Response(
            {'details': 'Please enter a valid email format'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(password) < 6:
        return Response(
            {'details': 'Password must be at least 6 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
        return Response(
            {'details': 'Email already registered. Please login.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    User.objects.create_user(
        username=email,
        email=email,
        first_name=fname,
        last_name=lname,
        password=password,
        is_active=True
    )

    return Response(
        {'details': 'Signup successful! You can now login.'},
        status=status.HTTP_201_CREATED
    )


# =========================
# ACCOUNT ACTIVATION
# =========================

class ActivateAccountView(View):

    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            user = None

        if user is not None and generate_token.check_token(user, token):
            user.is_active = True
            user.save()
            return render(request, "activatesuccess.html")

        return render(request, "activatefail.html")


# =========================
# ORDERS
# =========================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    order_items = data.get('orderItems', [])

    if not order_items:
        return Response(
            {'details': 'No Order Items'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        order = Order.objects.create(
            user=user,
            paymentMethod='Cash on Delivery',
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country']
        )

        for item_data in order_items:
            product = Product.objects.get(_id=item_data['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=item_data['qty'],
                price=item_data['price'],
                image=product.image.url if product.image else ''
            )

            product.countInStock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except (Product.DoesNotExist, KeyError, TypeError, ValueError) as error:
        return Response(
            {'details': str(error)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    orders = request.user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    try:
        order = Order.objects.get(_id=pk)

        if request.user.is_staff or order.user == request.user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)

        return Response(
            {'details': 'Not authorized to view this order'},
            status=status.HTTP_403_FORBIDDEN
        )

    except Order.DoesNotExist:
        return Response(
            {'details': 'Order does not exist'},
            status=status.HTTP_404_NOT_FOUND
        )


# =========================
# ADMIN PRODUCT FUNCTIONS
# =========================

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    product = Product.objects.create(
        user=request.user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        description=''
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        data = request.data

        product.name = data['name']
        product.price = data['price']
        product.brand = data['brand']
        product.countInStock = data['countInStock']
        product.category = data['category']
        product.description = data['description']

        product.save()

        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)

    except Product.DoesNotExist:
        return Response(
            {'details': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
def uploadImage(request):
    try:
        product_id = request.data['product_id']
        product = Product.objects.get(_id=product_id)
        image = request.FILES.get('image')

        if not image:
            return Response(
                {'details': 'No image uploaded'},
                status=status.HTTP_400_BAD_REQUEST
            )

        product.image = image
        product.save()

        return Response({'details': 'Image was uploaded'})

    except Product.DoesNotExist:
        return Response(
            {'details': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        product.delete()
        return Response({'details': 'Product deleted'})
    except Product.DoesNotExist:
        return Response(
            {'details': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )


# =========================
# USER MANAGEMENT
# =========================

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserById(request, pk):
    try:
        user = User.objects.get(id=pk)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(
            {'details': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    serializer = UserSerializer(request.user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data

    user.first_name = data.get('fname', user.first_name)
    user.last_name = data.get('lname', user.last_name)

    if data.get('password'):
        user.password = make_password(data['password'])

    user.save()

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    try:
        user = User.objects.get(id=pk)
        user.delete()
        return Response({'details': 'User deleted'})
    except User.DoesNotExist:
        return Response(
            {'details': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    try:
        user = User.objects.get(id=pk)
        data = request.data

        user.first_name = data.get('name', user.first_name)
        user.email = data.get('email', user.email)
        user.is_staff = data.get('isAdmin', user.is_staff)

        user.save()

        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)

    except User.DoesNotExist:
        return Response(
            {'details': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
