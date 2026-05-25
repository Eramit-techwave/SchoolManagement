from django.db import models

class Student(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('O+', 'O+'), ('O-', 'O-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
    ]

    # Personal Info
    name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES, blank=True)
    religion = models.CharField(max_length=50, blank=True)
    aadhar_number = models.CharField(max_length=12, blank=True)
    photo = models.ImageField(upload_to='students/', blank=True, null=True)

    # School Info
    roll_number = models.CharField(max_length=20, unique=True)
    # admission_number = models.CharField(max_length=20, unique=True, blank=True)
    admission_number = models.CharField(max_length=20, blank=True)
    class_name = models.CharField(max_length=20)
    section = models.CharField(max_length=5, blank=True)
    admission_date = models.DateField(null=True, blank=True)
    previous_school = models.CharField(max_length=200, blank=True)
    # previous_school_marks = models.CharField(max_length=20, blank=True) 

    # Contact Info
    email = models.EmailField(unique=True, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)

    # Parent Info
    father_name = models.CharField(max_length=100, blank=True)
    father_phone = models.CharField(max_length=15, blank=True)
    mother_name = models.CharField(max_length=100, blank=True)
    mother_phone = models.CharField(max_length=15, blank=True)
    parent_email = models.EmailField(blank=True)

    # Transport & Hostel
    bus_route = models.CharField(max_length=100, blank=True)
    hostel = models.BooleanField(default=False)
    hostel_room = models.CharField(max_length=20, blank=True)
    
    
    

    # Eye Scanner
    iris_image = models.ImageField(upload_to='iris/', blank=True, null=True)

    # System
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.roll_number}"