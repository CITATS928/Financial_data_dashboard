from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.messages import get_messages
from .models import UserActivity
import logging

from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

from django.db.models import Sum
from .models import FinancialLineItem
from django.db.models.functions import ExtractYear
from django.utils.timezone import now
from django.db.models.functions import ExtractQuarter

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"message": "CSRF cookie set"})


logger = logging.getLogger(__name__)

# Create your views here.

def index(request):
    return render(request, 'index.html')

def login_view(request):
    return render(request, 'login.html')

# def signup_view(request):
#     return render(request, 'signup.html')

# Signup Page
def SignupPage(request):
    if request.method == 'POST':
        uname = request.POST.get('username')
        email = request.POST.get('email')
        pass1 = request.POST.get('password1')
        pass2 = request.POST.get('password2')

        if pass1 != pass2:
            messages.error(request, "Your password and confirm password do not match!")
            return redirect('/signup/')
        
        if User.objects.filter(username=uname).exists():
            messages.warning(request, "Username already taken. Try another one.")
            return redirect('/signup/')

        # User creation (Corrected indentation)
        my_user = User.objects.create_user(username=uname, email=email, password=pass1)
        my_user.save()

        # Logging for console
        logger.info(f"New user {uname} registered with email {email}.")

        # Logging for database (Use `my_user`, not `request.user`)
        UserActivity.objects.create(
            user=my_user,
            action="account creation",
            ip_address=request.META.get('REMOTE_ADDR'),
            page=request.path
        )

        messages.success(request, "Account created successfully! Please log in.")
        return redirect('/login/')

    return render(request, 'signup.html')

# Login Page
def LoginPage(request):

    storage = get_messages(request)  # Consume messages so they don't persist
    for _ in storage:
        pass  # This will clear any existing messages

    if request.method == 'POST':
        username = request.POST.get('username')
        pass1 = request.POST.get('password')
        user = authenticate(request, username=username, password=pass1)

        if user is not None:
            login(request, user)
            logger.info(f"User {username} logged in")

            # Logging user activity
            UserActivity.objects.create(
                user=user,  # Use authenticated `user`, not `request.user`
                action="logged in",
                ip_address=request.META.get('REMOTE_ADDR'),
                page=request.path
            )

            messages.success(request, "You have successfully logged in.")
            return redirect('http://localhost:3000/dashboard')

        else:
            logger.warning(f"Failed login attempt for username {username}. Password: {pass1}")
            messages.error(request, "Invalid username or password!")
            return redirect('/login/')  
        
    return render(request, 'login.html')

# Logout Page
def LogoutPage(request):
    if request.user.is_authenticated:  # Check if user is logged in
        username = request.user.username

        # Logging user activity before logout
        UserActivity.objects.create(
            user=request.user,
            action="logged out",
            ip_address=request.META.get('REMOTE_ADDR'),
            page=request.path
        )

        logout(request)  
        logger.info(f"User {username} logged out.")

        # Consume messages to prevent them from persisting
        storage = get_messages(request)
        for _ in storage:
            pass  # Access messages to clear them

        messages.info(request, "You have been logged out successfully.")

    return redirect('/login/')

#Aggregate sum

def aggregate_report(request):
    result = FinancialLineItem.objects.values('entity_name').annotate(total_actual=Sum('ytd_actual'))
    total_actual_all_entities = FinancialLineItem.objects.aggregate(total_actual_all_entities=Sum('ytd_actual'))
    entities = (
        FinancialLineItem.objects
        .values('entity_name')
        .annotate(total_actual=Sum('ytd_actual'))
        .order_by('entity_name')
    )

    # Return both individual totals and aggregate total
    return JsonResponse({
        'entities': list(result),  
        'total_actual_all_entities': total_actual_all_entities['total_actual_all_entities']  # Overall total
    })


def get_entity_names(request):
    entities = FinancialLineItem.objects.values_list('entity_name', flat=True).distinct()
    return JsonResponse(list(entities), safe=False)

def entity_yearly_actual(request, entity_name):
    current_year = now().year
    past_seven_years = current_year - 6
    data = (
        FinancialLineItem.objects
        .filter(entity_name=entity_name, date__year__gte=past_seven_years)
        .annotate(year=ExtractYear('date'))
        .values('year')
        .annotate(total_actual=Sum('ytd_actual'))
        .order_by('year')
    )
    return JsonResponse(list(data), safe=False)

def entity_quarterly_actual(request, entity_name):
        current_year = now().year
        past_seven_years = current_year - 6
        data = (
            FinancialLineItem.objects
            .filter(entity_name=entity_name, date__year__gte=past_seven_years)
            .annotate(year=ExtractYear('date'), quarter=ExtractQuarter('date'))
            .values('year', 'quarter')
            .annotate(total_actual=Sum('ytd_actual'))
            .order_by('year', 'quarter')
        )
        return JsonResponse(list(data), safe=False)

def get_entity_detail(request, entity_name):
    data = FinancialLineItem.objects.filter(entity_name=entity_name).values()
    return JsonResponse(list(data), safe=False)

    
def get_all_items(request):
    data = FinancialLineItem.objects.all().values()
    return JsonResponse(list(data), safe=False)
