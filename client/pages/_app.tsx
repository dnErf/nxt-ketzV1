import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../axios/build_client';
import Header from '../components/header';

const NxtApp = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={ currentUser } />
      <div className="container">
        <Component {...pageProps} currentUser={ currentUser } />
      </div>
    </div>
  )
}

NxtApp.getInitialProps = async (appContext) => {
  let client = buildClient(appContext.ctx);
  let { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    // when `getInitialProps` is defined at app level, it was not invoke properly
    // here we are invoking `getInitialProps`
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }

  return {
    pageProps,
    ...data,
  };
}

export default NxtApp
