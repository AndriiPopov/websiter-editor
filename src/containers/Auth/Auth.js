import React, { useState, useEffect } from 'react'

import Checkbox from '../../components/UI/Checkbox/Checkbox'
import Cookies from 'universal-cookie'
import LoginButton from '../../components/UI/LoginButton/LoginButton'

const cookies = new Cookies()

type Props = {
    test?: boolean,
}

const Auth = (props: Props) => {
    const [state: boolean, setState] = useState(false)
    const [cookieConsent: boolean, setCookieConsent] = useState(false)

    useEffect(() => {
        checkCookieConsent()
    })

    let remeberMeParam = '?rememberme=false'
    if (state) {
        remeberMeParam = '?rememberme=true'
    }

    const checkCookieConsent = () => {
        const cookiesConsent = cookies.get('cookies_consent')
        if (cookiesConsent) {
            setCookieConsent(true)
        }
    }

    const agreeWithCookies = () => {
        cookies.set('cookies_consent', 'true', {
            path: '/',
            maxAge: 31530000000,
        })
        checkCookieConsent()
    }
    return !cookieConsent ? (
        <>
            <div>
                We use cookies only for login purposes. In order to proceed you
                need to agree with the use of cookies.
            </div>
            <LoginButton btnType="Success" clicked={agreeWithCookies}>
                AGREE
            </LoginButton>
            <LoginButton
                btnType="Danger"
                clicked={() => {
                    window.open('https://websiter.dev', '_self')
                }}
            >
                Return to the homepage
            </LoginButton>
        </>
    ) : (
        <>
            {process.env.NODE_ENV !== 'development' ? (
                <div>
                    <a
                        href={
                            'https://my.websiter.dev/api/auth/google/start' +
                            remeberMeParam
                        }
                    >
                        GOOGLE
                    </a>
                    <a
                        href={
                            'https://my.websiter.dev/api/auth/facebook/start' +
                            remeberMeParam
                        }
                    >
                        FACEBOOK
                    </a>
                    <a
                        href={
                            'https://my.websiter.dev/api/auth/twitter/start' +
                            remeberMeParam
                        }
                    >
                        TWITTER
                    </a>
                </div>
            ) : (
                <div>
                    <a
                        href={
                            'http://my.websiter.dev:5000/api/auth/google/start' +
                            remeberMeParam
                        }
                    >
                        GOOGLE
                    </a>
                    <a
                        href={
                            'http://my.websiter.dev:5000/api/auth/facebook/start' +
                            remeberMeParam
                        }
                    >
                        FACEBOOK
                    </a>
                    <a
                        href={
                            'http://my.websiter.dev:5000/api/auth/twitter/start' +
                            remeberMeParam
                        }
                    >
                        TWITTER
                    </a>
                </div>
            )}
            <Checkbox
                title="Remember me"
                checked={state}
                onChange={() => setState(!state)}
            />
        </>
    )
}
export default Auth
