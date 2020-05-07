const baseUrl = 'http://localhost:3000'
const header = { "Authorization": 'bearer ' + token };
/**
 * simple search function
 * 
 * @async
 * @param {String} query 
 * @returns {Promise<object>}
 */
function searchServices(query) {
    return new Promise((resolve, reject) => {
        $.get(baseUrl + "/services/search", { q: query }, function (data) {
            return resolve(data);
        })
    })
}


/**
 * Sign up a user
 * 
 * @async
 * @param {Integer} gender - male: 0, female: 1
 * @param {String} username - min-length: 3
 * @param {String} password - min-length: 8
 * @param {String} usertype - admin: 1, staff: 2, freelancer: 3, customer: 4 
 * @return {Promise<object>}
 */
function signup(firstname, lastname, gender, phone, birthdate, email, username, password, usertype) {

    const user = {
        username: username,
        firstname: firstname,
        lastname: lastname,
        password: password,
        phone: phone,
        birthdate: birthdate,
        email: email,
        gender: gender,
        usertype_id: usertype
    };

    console.log(JSON.stringify(user));

    return new Promise((resolve, reject) => {
        $.post({
            url: baseUrl + "/auth" + '/signup',
            data: JSON.stringify(user),
            dataType: "json",
            contentType: "application/json",
            statusCode: {
                422: (data) => {
                    reject(data);
                }
            },
            success: function (data) {
                resolve(data)
            }
        })
    })
}

/**
 * Sign a user in
 * this function also caches the JWT {token, id, usertype_id, expiresIn} 
 * JWT token is the proof of user sign in. So if it was invalidated then the user is signed out
 * 
 * @async
 * @param {String} username - min-length: 3
 * @param {String} password - min-length: 8
 * @returns {Promise<object>}
 */
function signin(username, password) {
    return new Promise((resolve, reject) => {
        $.post({
            url: baseUrl + "/auth" + '/signin',
            data: JSON.stringify({ password: password, username: username }),
            dataType: "json",
            contentType: "application/json",
            statusCode: {
                401: (data) => {
                    reject(data);
                }
            },
            success: function (response) {
                window.localStorage.setItem('token', response.token);
                window.localStorage.setItem('id', response.id);
                window.localStorage.setItem('usertype_id', response.usertype_id);
                window.localStorage.setItem('expiresIn', response.expiresIn);
                resolve(response);
            }
        })
    })
}


/**
 * Gets all statistics that luqman aches for
 * 
 * @assumptions - the user is logged in
 * @assumptions - the user is an admin
 * 
 * @see {@link signin} for token caching
 */
function getReport() {
    const token = window.localStorage.getItem('token');

    return new Promise((resolve, reject) => {
        $.ajax({
            url: baseUrl + '/admin' + '/statistics',
            method: 'GET',
            headers: header,
            success: (data) => resolve(data),
            error: (err) => reject(err)
        })
    })
}

/**
 * @see {@link getReport - Assumptions}
 * 
 * @param {Integer} userId - the user to be banned
 */
function banUser(userId) {

    return new Promise((resolve, reject) => {
        $.ajax({
            url: baseUrl + '/admin' + '/ban',
            method: "POST",
            data: {id: userId},
            header: header,
            success: (data) => resolve(data),
            error: (err) => reject(err)
        })
    })
}

function createOrder(){
    
}
