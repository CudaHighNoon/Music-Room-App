# Code Citations

## License: unknown
https://github.com/RohitPrajapat08/Django-Projects/tree/6cd92a77b759f8f216cbb486ee729cccf89cc69a/drf/urls.py

```
urls.py
   from django.contrib import admin
   from django.urls import path, include

   urlpatterns = [
       path('admin/', admin.site.urls),
       path('api/', include('api.urls')),  # Include the app
```

