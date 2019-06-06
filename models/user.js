const db = require('./conn'),
    bcrypt = require('bcryptjs');

class User {
    constructor(id, first_name, last_name, email, password) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
    }

    // bcrypt can be SLOOOOOWW, so we'll wrap this in an async
    async checkPassword(hashedPassword) {
        // syntax: bcrypt.compareSync(arg1, arg2);
        // first argument is what the user put in the form
        // second argument is the hashed password
        // returns true or false
        return bcrypt.compareSync(this.password, hashedPassword);
    }

    async save() {
        try {
            const response = await db.one(`
                insert into users 
                    (first_name, last_name, email, password)
                values
                    ($1, $2, $3, $4)
                returning id
                `, [this.first_name, this.last_name, this.email, this.password]);
            console.log("user was created with id:", response.id);
            return response;
        } catch(err) {
            return err.message;
        }
    }

    async login() {
        try {
            const response = await db.one(`
                select id, first_name, last_name, password
                    from users
                where email = $1`, [this.email]);
            const isValid = await this.checkPassword(response.password);
            if (!!isValid) {        
            // if (isValid === absolutely, totally, like really, true)
                // destructure the values we want from the response
                const { first_name, last_name, id } = response;
                // this line will return the isValid, first name, last name, and user id
                return { isValid, first_name, last_name, user_id: id }
            } else {
                // Just return the false isValid
                return { isValid }
            };
        } catch(err) {
            return err.message;
        }
    }
}

module.exports = User;