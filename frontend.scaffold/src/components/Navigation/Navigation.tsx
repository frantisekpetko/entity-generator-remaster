import './NavigationStyles.scss'
import LazyImage from "../LazyImage";
import headerImg from "../../assets/header.png";
import Flex from "../Flex";
import {useNavigate} from "react-router-dom";
import { Link } from 'react-router-dom';



export default function Navigation() {
    const navigate = useNavigate();
    return (
        <>
            <div className="Navigation">
                <Flex direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <a className="active" href="#" onClick={()=> navigate('/')}>
                        <LazyImage image={{alt: 'some picture', src: headerImg, width: 420, height: 60}}/>
                    </a>

                    <Flex
                        direction={'row'}
                        justifyContent={'flex-end'}
                        alignItems={'flex-end'}
                        alignContent={'flex-end'}
                        styles={{padding: '0 2em'}}
                    >
                        <>
                            <Link to={'/entity'}>Entity generator</Link>
                            <Link to={'/explorer'} >Entity explorer</Link>
                            
                        </>

                    </Flex>
                </Flex>



            </div>

         </>
    )
}