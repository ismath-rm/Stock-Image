# from typing import Any
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
# from product_management.models import *
from django.core.exceptions import ValidationError
# from django.utils import timezone
# from django.contrib.auth.models import AbstractBaseUser, UserManager,PermissionsMixin,Permission,Group

class AccountManager(BaseUserManager):
    def create_user(self, username, email, phone, password):
        if not email:
            raise ValueError("User must have a email")
        if not username:
            raise ValueError("User must have an username")
        user=self.model(
            email=self.normalize_email(email),
            username=username,
            phone=phone,
            is_active=True
            
        )

        # user.is_active = True
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_superuser(self, username, email, phone, password):
        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
            phone=phone
        )
        user.is_admin = True
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


# Custom user model
class Account(AbstractBaseUser):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    phone =models.CharField(max_length=50)
   

    # required
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "phone"]

    objects = AccountManager()

    def __str__(self):
        return self.email

    # Check user permissions
    def has_perm(self, perm, obj=None):
        return self.is_admin

    # Check user module permissions
    def has_module_perms(self, add_label):
        return True
    