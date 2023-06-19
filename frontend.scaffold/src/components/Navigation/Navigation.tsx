import './NavigationStyles.scss'
import headerImg from "../../assets/header.png";
import { Flex, LazyImage } from '@/components';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { NavLink } from "react-router-dom";



export default function Navigation() {
    const navigate = useNavigate();

    return (
        <>
            <div className="Navigation">
                <Flex direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <a className="active" href="#" onClick={() => navigate('/')}>
                        <LazyImage image={{ alt: 'some picture', src: headerImg, width: 420, height: 60 }} />
                    </a>

                    <Flex
                        direction={'row'}
                        justifyContent={'flex-end'}
                        alignItems={'flex-end'}
                        alignContent={'flex-end'}
                        styles={{ padding: '0 2em' }}
                    >
                        <>
                            <NavLink
                                to={'/entity'}
                                className={({ isActive }) =>
                                    isActive ? 'ActiveLink' : undefined
                                }
                            >
                                Entity generator
                            </NavLink>
                            <NavLink
                                to={'/explorer'}
                                className={({ isActive }) =>
                                    isActive ? 'ActiveLink' : undefined
                                }
                            >
                                Entity explorer
                            </NavLink>
                            <NavLink
                                to={'/assistant'}
                                className={({ isActive }) =>
                                    isActive ? 'ActiveLink' : undefined
                                }
                            >
                                Database Assistant
                            </NavLink>

                        </>

                    </Flex>
                </Flex>
            </div>

        </>
    )
}