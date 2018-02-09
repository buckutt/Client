export default () => {
    return (
        window.localStorage.getItem('headers') &&
        window.localStorage.getItem('sellers')
    );
};
