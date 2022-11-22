import type {CardInfo} from "@/components";
import "./CardStyles.scss";
import Flex from "../Flex";
import {useNavigate} from "react-router-dom";
import { faChevronRight, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export default function Card(props: {item: CardInfo}) {
    const {name, description, path} = props.item;
    const navigate = useNavigate();

    return (
        <>
            <article className={'CardContainer'}>
                <div className={'Card'}>
                    <div className={'Content'}>
                        <h3>{name}</h3>
                        <p>{description}</p>

                        <div className={'ButtonContainer'}>
                            <button
                                className={'Button'}
                                onClick={() => navigate(path)}
                            >
                                {"Begin".toUpperCase()} <FontAwesomeIcon icon={faChevronRight} size="sm" />
                            </button>
                        </div>


                    </div>


                </div>
            </article>

        </>
    )
}
