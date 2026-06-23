import MyComputer from '../img/MyComputer.webp';

const MobileBlock = () => (
    <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
        background: '#008080',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: 'Tahoma, sans-serif',
        gap: '1rem',
    }}>
        <img src={MyComputer} alt='' style={{ width: 64 }} width={64} height={64}/>
        <h1 style={{ fontSize: '1.2rem', margin: 0 }}>Windows XP</h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0, lineHeight: 1.6 }}>
            This application is designed for desktop use only.<br />
            Please open it on a larger screen.
        </p>
    </main>
);

export default MobileBlock;