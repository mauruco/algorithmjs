const Config = () => {

    if(process.env.NODE_ENV === 'development'){

        return {
            url: 'http://localhost:3000'
        };
    }
        
    return {
        url: 'https://htmlpreview.github.io/?https://github.com/mauruco/phaser3/blob/master/index.html'
    };
};

export default Config;