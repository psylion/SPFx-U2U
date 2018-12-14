ls node_modules -Recurse -Directory | foreach { rm $_ -Recurse -Force }

ls temp -Recurse -Directory| foreach { rm $_ -Recurse -Force }

ls dist -Recurse -Directory| foreach { rm $_ -Recurse -Force }

ls lib -Recurse -Directory| foreach { rm $_ -Recurse -Force }