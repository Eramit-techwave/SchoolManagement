from django.db import models

class Staff(models.Model):
    ROLE_CHOICES = [
        ('Teacher', 'Teacher'),
        ('Principal', 'Principal'),
        ('Librarian', 'Librarian'),
        ('Accountant', 'Accountant'),
        ('Security Guard', 'Security Guard'),
        ('Driver', 'Driver'),
        ('Peon', 'Peon'),
        ('Other', 'Other'),
    ]
    DEPARTMENT_CHOICES = [
        ('Science', 'Science'),
        ('Mathematics', 'Mathematics'),
        ('English', 'English'),
        ('Hindi', 'Hindi'),
        ('Social Science', 'Social Science'),
        ('Computer', 'Computer'),
        ('Administration', 'Administration'),
        ('Accounts', 'Accounts'),
        ('Library', 'Library'),
        ('Security', 'Security'),
        ('Transport', 'Transport'),
        ('Other', 'Other'),
    ]

    # Personal Info
    name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    religion = models.CharField(max_length=50, blank=True)
    aadhar_number = models.CharField(max_length=12, blank=True)
    photo = models.ImageField(upload_to='staff/', blank=True, null=True)

    # Job Info
    employee_id = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Teacher')
    department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES, blank=True)
    subject = models.CharField(max_length=100, blank=True)
    qualification = models.CharField(max_length=200, blank=True)
    experience = models.IntegerField(default=0)
    joining_date = models.DateField(null=True, blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Contact Info
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)

    # Emergency Contact
    emergency_name = models.CharField(max_length=100, blank=True)
    emergency_phone = models.CharField(max_length=15, blank=True)
    emergency_relation = models.CharField(max_length=50, blank=True)

    # Eye Scanner
    iris_image = models.ImageField(upload_to='iris/', blank=True, null=True)

    # System
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.role}"