import React from 'react';
import "./BarChart.css"
import { Card, CardBody, CardImage, CardText, Fa } from 'mdbreact';
import { Bar } from 'react-chartjs-2';

const BarChart = props => (
    <Bar data={props.chartData} />
)

export default BarChart