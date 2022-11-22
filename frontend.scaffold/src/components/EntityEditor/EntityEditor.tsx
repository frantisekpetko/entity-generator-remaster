import React, { useEffect, useState, useRef } from 'react';
import Navigation from "../../components/Navigation";
import Input from "../../components/Input";
import Flex from "../../components/Flex";
import Select from "../../components/Select";
import Switch from "../../components/Switch/Switch";
import Checkbox from "../../components/Checkbox/Checkbox";
import Modal from '../../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { JsonFetch } from '@/utils/net';
import {Column, FormState} from './types';
import EntityEditorStyles from "./EntityEditorStyles.module.scss";

export default function EntityEditor(props: { data: any, heading: string, entities: { entityName: string, filename: string, table: string }[] }): ReturnType<React.FC>{

    let originalEntityName = useRef('');


    const [formState, setFormState] = useState<FormState>({
        name: '',
        originalName: '',
        columns: [{
            nameOfColumn: "",
            datatype: 'varchar',
            notNull: true,
            unique: false,
            index: false,
        }],
        relationships: [{
            type: 'OneToOne',
            table: ''
        }]
    });

    useEffect(() => {
        originalEntityName.current = formState.name;

    }, [])

    useEffect(() => {
        console.log('Props', Object.keys(props.data).length)
        Object.keys(props.data).length > 0 ? setFormState({...props.data}) : null;
    }, [props.data])

    const [open, setOpen] = useState<boolean>(false);

    function modalOpenHandler() {
        setOpen((prevState) => !prevState);
    }

    const DataTypes: {
        label: string,
        value: {
            columnProperty: string,
            name: string
        }

    }[] =
        [
            { label: 'varchar', value: { columnProperty: 'varchar', name: 'varchar' } },
            { label: 'text', value: { columnProperty: 'text', name: 'text' } },
            { label: 'integer', value: { columnProperty: 'integer', name: 'integer' } },
            { label: 'blob', value: { columnProperty: 'blob', name: 'blob' } },
            { label: 'double', value: { columnProperty: 'double', name: 'double' } },
            { label: 'boolean', value: { columnProperty: 'boolean', name: 'boolean' } },
            { label: 'date', value: { columnProperty: 'date', name: 'date' } },
            { label: 'datetime', value: { columnProperty: 'datetime', name: 'datetime' } },

        ];



    const [entityModelTxt, setEntityModelTxt] = useState<string>('');




    useEffect(() => {
        console.table(formState.columns)
    }, [formState])

    const handleChange = (name: string, columnx: number) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        if (name === 'unique' || name === 'notNull' || name === 'index') {
            let { columns }: any = formState;

            columns[columnx][name] = !columns[columnx][name];
            console.warn(name, columns[columnx][name], columns[columnx], event.target.value);
            setFormState((prevState) => ({
                ...prevState,
                ...columns,


            }))
            return;
        }


        if (name === 'name') {
            setFormState((prevState) => ({
                ...prevState,
                name: event.target.value


            }))
            return;
        }

        let { columns }: any = formState;
        console.log(columns)
        columns[columnx][name] = event.target.value;
        console.warn('event columns', event.target.value);
        setFormState((prevState) => ({
            ...prevState,
            ...columns,


        }))

    };


    const relationshipChangeHandler = (name: string, columnx: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        /*
        if (name === 'unique' || name === 'notNull' || name === 'index') {
            let { relationships }: any = formState;

            relationships[columnx][name] = !relationships[columnx][name];
            console.warn(name, relationships[columnx][name], relationships[columnx], event.target.value);
            setFormState((prevState) => ({
                ...prevState,
                ...relationships,


            }))
            return;
        }


        if (name === 'name') {
            setFormState((prevState) => ({
                ...prevState,
                name: event.target.value


            }))
            return;
        }
        */

        if (name === 'type') {
            let { relationships }: any = formState;

            relationships[columnx][name] = event.target.value;
            //console.warn(name, relationships[columnx][name], relationships[columnx], event.target.value);
            setFormState((prevState) => ({
                ...prevState,
                ...relationships,


            }))
        }

        let { relationships }: any = formState;
        console.log(relationships)
        relationships[columnx][name] = event.target.value;
        //console.warn(name, relationships[columnx][name], relationships[columnx], event.target.value);
        setFormState((prevState) => ({
            ...prevState,
            ...relationships,


        }))

        console.warn('rel', formState.relationships, columnx)




    };

    const handleChangeIndex = (name: string, column?: number) => (event: React.ChangeEvent<HTMLInputElement>) => {

    }

    const handleChangeUnique = (name: string, column?: number) => (event: React.ChangeEvent<HTMLInputElement>) => {

    }

    const addColumnHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setFormState((prevState) => ({
            ...prevState,
            columns: [...prevState.columns, {
                openSelection: false,
                nameOfColumn: "",
                datatype: 'varchar',
                notNull: true,
                unique: false,
                index: false,
            }],


        }))
    }

    const dropColumnHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, column: number) => {
        e.preventDefault();
        let columnObj = formState.columns;
        console.log(column)


        if (columnObj.length > 1) {
            columnObj.splice(column, 1);
            console.log("report", columnObj);
            setFormState((prevState) => ({
                ...prevState,
                column: [...columnObj]
            }));
        }

    };

    const addRelationshipHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setFormState((prevState) => ({
            ...prevState,
            relationships: [...prevState.relationships, {
                type: 'OneToOne',
                table: 'Person'
            }],


        }))
    }

    const dropRelationshipHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, column: number) => {
        e.preventDefault();
        let { relationships } = formState;
        console.log(column)



        relationships.splice(column, 1);
        console.log("report", relationships);
        setFormState((prevState) => ({
            ...prevState,
            relationships: [...relationships]
        }));


    };

    return <>
        <Flex
            width='100%'
            justifyContent='center'
            styles={{
                margin: '5em 0 1em 0',
                flex: '1 0 auto'
            }}
            alignItems='center'
            direction='column'>

            <h1>{props.heading}</h1>

            <Input
                placeholder={'Entity name'}
                value={formState.name}
                onChange={handleChange('name', 0)}
            />
            <form onSubmit={async (e) => {
                e.preventDefault();

                let txt: { data: string } = await (
                    await JsonFetch.post('entitygen', 
                    {
                         name: formState.name, 
                         columns: [...formState.columns],
                         relationships: [...formState.relationships],
                         originalEntityName: originalEntityName.current
                    })
                ).json();
                setEntityModelTxt(txt.data);
                setOpen(true);
                originalEntityName.current = formState.name;
                console.log('txt', txt.data)
            }
            }>


                {formState.columns.map((column, index) => (

                    <Flex

                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        alignContent="center"

                        key={index}
                        styles={{ marginTop: '1em', gap: '1em', lineHeight: '2em' }}
                    >
                        <Input
                            placeholder={"Column " + (index + 1)}
                            value={formState.columns[index].nameOfColumn}
                            onChange={handleChange('nameOfColumn', index)}
                            styles={{ marginRight: '1em' }}

                        />

                        <Select
                            onChange={handleChange('datatype', index)}
                            value={formState.columns[index].datatype}
                            data={DataTypes}
                            label={'Datatype'}
                            themeColor='#b8860b'

                        />
                        <Flex direction={'row'} width={'25%'} alignItems={'center'} styles={{ marginTop: '2em', lineHeight: '2.5em' }}>

                            <Checkbox checked={formState.columns[index].notNull} onChange={handleChange('notNull', index)} />

                            <label style={{ marginLeft: '0.5em', width: '4em' }}>Not Null</label>
                        </Flex>
                        <Flex direction={'row'} width={'25%'} styles={{ marginTop: '2em', lineHeight: '2.5em' }}>

                            <Checkbox checked={formState.columns[index].unique} onChange={handleChange('unique', index)} />

                            <label style={{ marginLeft: '0.5em', width: '4em' }}>Unique</label>
                        </Flex>
                        <Flex direction={'row'} width={'25%'} styles={{ marginTop: '2em', lineHeight: '2.5em' }}>

                            <Checkbox checked={formState.columns[index].index} onChange={handleChange('index', index)} />

                            <label style={{ marginLeft: '0.5em', width: '4em' }}>Index</label>
                        </Flex>


                        <Flex direction={'row'} width={'100%'} styles={{ marginTop: '2em', lineHeight: '3em' }}>
                            <button className={EntityEditorStyles.Buttonx}
                                style={{ borderRadius: '100%', lineHeight: '0em', width: '1.2em', height: '1.2em', fontSize: '1.5em', border: 'none', background: 'goldenrod', color: 'white' }}
                                onClick={(e) => dropColumnHandler(e, index)}

                            >  <FontAwesomeIcon icon={faMinus} size="2xs" /></button>
                        </Flex>




                    </Flex>
                ))}
                <Flex direction={'column'} alignItems={'center'} width={'100%'} styles={{ marginTop: '2em', lineHeight: '2.5em' }}>
                    <button className={EntityEditorStyles.Buttonx} onClick={(e) => addColumnHandler(e)}
                        style={{ borderRadius: '100%', lineHeight: '0em', width: '1.2em', height: '1.2em', fontSize: '1em', border: 'none', background: 'goldenrod', color: 'white' }}
                    ><FontAwesomeIcon icon={faPlus} size="2xs" />
                    </button>
                </Flex>



                {formState.relationships.map((column, index) => (

                    <Flex

                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        alignContent="center"

                        key={index}
                        styles={{ margin: '1em auto', gap: '1em', lineHeight: '2em', width: '60%' }}
                    >


                        <Select
                            onChange={relationshipChangeHandler('type', index)}
                            value={formState.relationships[index].type}
                            data={[
                                {
                                    label: 'OneToOne',
                                    value: {
                                        name: 'OneToOne'
                                    }
                                },
                                {
                                    label: 'OneToMany',
                                    value: {
                                        name: 'OneToMany'
                                    }
                                },
                                {
                                    label: 'ManyToOne',
                                    value: {
                                        name: 'ManyToOne'
                                    }
                                },
                                {
                                    label: 'ManyToMany',
                                    value: {
                                        name: 'ManyToMany'
                                    }
                                }
                            ]

                            }
                            label={'Relationship type'}
                            themeColor='#DC582A'
                        />

                        <Select
                            onChange={relationshipChangeHandler('table', index)}
                            value={formState.relationships[index].table}
                            data={
                                props.entities.length > 0 
                                ? [{
                                        label: 'No Selected Entity', value:
                                        {
                                            name: 'null'
                                        }
                                }, ...props.entities] 
                                : [{
                                    label: 'No data', value:
                                    {
                                        name: 'null'
                                    }
                                }]
                                /*
                                {
                                    label: 'Person', value:
                                    {
                                        name: 'person'
                                    }
                                },
                                {
                                    label: 'Animal', value:
                                    {
                                        name: 'animal'
                                    }
                                }*/
                            }
                            label={"Entity name "}
                            themeColor='#DC582A'
                            styles={{ marginRight: '1em' }}

                        />









                        <Flex direction={'row'} width={'100%'} styles={{ marginTop: '2em', lineHeight: '3em' }}>
                            <button className={EntityEditorStyles.Buttonx}
                                style={{ borderRadius: '100%', lineHeight: '0em', width: '1.2em', height: '1.2em', fontSize: '1.5em', border: 'none', background: '#DC582A', color: 'white' }}
                                onClick={(e) => dropRelationshipHandler(e, index)}

                            ><FontAwesomeIcon icon={faMinus} size="2xs" /></button>
                        </Flex>




                    </Flex>
                ))}

                <Flex direction={'column'} alignItems={'center'} width={'100%'} styles={{ marginTop: '2em', lineHeight: '2.5em' }}>
                    <button className={EntityEditorStyles.Buttonx} onClick={(e) => addRelationshipHandler(e)}
                        style={{ borderRadius: '100%', lineHeight: '0em', width: '1.2em', height: '1.2em', fontSize: '1.5em', border: 'none', background: '#DC582A', color: 'white' }}
                    >  <FontAwesomeIcon icon={faPlus} size="2xs" />

                    </button>
                </Flex>


                <Flex direction={'column'} alignItems={'center'} width={'100%'} styles={{ marginTop: '1em', lineHeight: '2.5em', width: '100%' }}>
                    <button type={'submit'}
                        style={{ borderRadius: '5%', padding: '1em', textTransform: 'uppercase', lineHeight: '0em', height: '1.2em', fontSize: '1.2em', border: 'none', background: 'grey', color: 'white' }}

                    >Preview</button>
                </Flex>
            </form>

        </Flex>
        <Modal open={open} modalOpenHandler={modalOpenHandler} data={entityModelTxt} name={formState.name} />

        </>;

}