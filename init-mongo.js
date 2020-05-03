db.createUser({
	user: "emp_user",
	pwd: "emp_pwd123",
	roles: [
		{
			role: "readWrite",
			db: "emp_database"
		}
	]
});
