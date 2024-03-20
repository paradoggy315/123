import React from 'react'

export const Login = () => {
    return (
        <form>
            <label for = "User ID">User ID</label>
            <input type = "User ID" placeholder = "Your User ID" id="User ID" name="User ID" />
            <label for = "Password">password</label>
            <input type = "Password" placeholder = "Your Password" id="Password" name="Password"/>
            <button> Log In</button>
        </form>
    )
}