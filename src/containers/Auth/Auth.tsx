import React, { useState, useEffect } from 'react'

import Checkbox from 'antd/es/checkbox'
import Cookies from 'universal-cookie'
import Button from 'antd/es/button'
import classes from './Auth.module.css'
import Svg from '../../components/Svg/Svg'

const cookies = new Cookies()

const Auth = () => {
    const [state, setState] = useState(false)
    const [cookieConsent, setCookieConsent] = useState(false)

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
            maxAge: 31530000,
        })
        checkCookieConsent()
    }
    const basicURL =
        process.env.NODE_ENV !== 'development'
            ? 'https://my.websiter.dev/api/auth/'
            : 'http://my.websiter.test:5000/api/auth/'
    return (
        <div className={classes.Container}>
            {!cookieConsent ? (
                <>
                    <div>
                        We use cookies only for login purposes. In order to
                        proceed you need to agree with the use of cookies.
                    </div>
                    <Button onClick={agreeWithCookies}>Agree</Button>
                    <Button
                        onClick={() => {
                            window.open('https://websiter.dev', '_self')
                        }}
                    >
                        Return to the homepage
                    </Button>
                </>
            ) : (
                <>
                    <h1>Continue with:</h1>
                    <div className={classes.socialButtons}>
                        <a href={basicURL + `google/start${remeberMeParam}`}>
                            <Svg icon='<svg width="50" height="50" viewBox="0 0 24 24"><path fill="#4285F4" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"></path></svg>' />
                            <div>GOOGLE</div>
                        </a>
                        <a href={basicURL + `facebook/start${remeberMeParam}`}>
                            <Svg icon='<svg width="50" height="50" viewBox="0 0 24 24"><path fill="#1877F2" d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z"></path></svg>' />
                            <div>FACEBOOK</div>
                        </a>
                        {/* <a href={basicURL + `twitter/start${remeberMeParam}`}>
                            <Svg icon='<svg width="50" height="50" viewBox="0 0 24 24"><path fill="#1DA1F2" d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"></path></svg>' />
                            <div>TWITTER</div>
                        </a> */}
                        <a href={basicURL + `github/start${remeberMeParam}`}>
                            <Svg icon='<svg width="50" height="50" viewBox="0 0 16 16"><path fill="#333" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"></path></svg>' />
                            <div>GITHUB</div>
                        </a>
                    </div>
                    <Checkbox checked={state} onChange={() => setState(!state)}>
                        Remember me
                    </Checkbox>
                </>
            )}
        </div>
    )
}
export default Auth
