import React from 'react';
import "./PieChart.css"
import { Card, CardBody, CardImage, CardText, Fa } from 'mdbreact';
import { Pie } from 'react-chartjs-2';

const PieChart = props => (
    <Pie
        data={props.chartData}
    />
)

export default PieChart