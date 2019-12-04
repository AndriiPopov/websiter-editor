import React from 'react'

type Props = {
    test?: boolean,
}

const Auth = (props: Props) => (
    <div>
        <a href="https://my.websiter.dev/api/auth/google/start">GOOGLE</a>
        <a href="https://api.websiter.dev/api/auth/facebook/start">FACEBOOK</a>
        <a href="https://api.websiter.dev/api/auth/twitter/start">TWITTER</a>
    </div>
)

export default Auth
