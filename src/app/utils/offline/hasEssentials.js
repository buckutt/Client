export default () => {
    return (window.localStorage.getItem('headers') &&
        window.localStorage.getItem('sellers') &&
        window.localStorage.getItem('meansOfPayment') &&
        window.localStorage.getItem('fullDevice') &&
        window.localStorage.getItem('event') &&
        window.localStorage.getItem('defaultItems'));
};
