How to set up this server

1) Install MySQL
2) Run Command line as admin

```
cd "C:\Program Files\MySQL\MySQL Server 5.7\bin\"
```

You might have to create a "data" folder in the "MySQL Server 5.7" folder

If it complains about your password at any point, create a text file with the following:
```
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('MyNewPass');
```

Then run this

```
mysqld --init-file="C:\Users\...whereeveritis...\localmysqlpassword.txt"
```

```
mysqld --install
mysqld --initialize-insecure
mysqld --console
```

3) Go to MySQL work bench. Click on Database menu -> connect to Database and select the local database from the dropdown. 