
import Flex from "../Flex";
import React from 'react';
import './FooterStyles.scss';


const Footer = (props: any) => {
    return <div className="footer">
        <Flex justifyContent={'space-between'} direction={'row'} alignItems={'center'} styles={{height: '100%'}}>
            <p className={'footer-text'}>
                Autor: František Petko
            </p>
            <p className={'footer-text'}>
                Development Code Generator
            </p>
        </Flex>
    </div>
};

export default Footer;