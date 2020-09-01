import { useEffect } from 'react';
import { useRouter, withRouter } from 'next/router';

const Login = (props) => {
    const router = useRouter();

    useEffect(() => {
        localStorage.setItem(
            '_password',
            props.router.query.id
        );

        router.push(`/`, `/`);
    }, [])

    return <div></div>
}

export default withRouter(Login);