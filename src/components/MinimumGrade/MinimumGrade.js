import React from 'react';

const FailStyle = {
    margin: '40px',
    border: '5px solid red'
  };


const MinimumGrade = (props) => (

    <div style={FailStyle}>
        <h1>Cuadro de horror:</h1>
        <h2>Nombre: {props.name} {props.lastName}</h2>
        <h3>Calificacion: {props.grade}</h3>
    </div>


)

export default MinimumGrade;