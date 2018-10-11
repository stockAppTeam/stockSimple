import React from 'react';
import "./Article.css"
import { Card, CardBody, CardImage, CardText, Fa } from 'mdbreact';

// This is the card component used to render the 'articles' on the home and saved pages
const Article = props => (
    <Card className="article-card m-2 h-100" cascade>
        <CardImage cascade className="card-image w-100" src={props.imgLink} />
        <CardBody className="p-2" cascade>
            <h5 className="text-white mb-2">{props.title}</h5>
            <div className="align-middle d-inline pt-2">
                <CardText className="text-white align-middle">{props.desc}</CardText>
            </div>
        </CardBody>
        <div className="rounded-bottom text-center">
            <ul className="list-unstyled list-inline font-small m-0 p-2">
                <li className="list-inline-item pr-2 white-text"><Fa icon="clock-o"></Fa>&nbsp;{props.date}</li>
                <li className="list-inline-item pr-2 white-text"><a target="_blank" href={props.link}>Visit Article</a></li>
                <li className="list-inline-item pr-2 white-text"><button onClick={props.actionBtn} className="turq-bg btn p-2">{props.action}</button></li>
            </ul>
        </div>
    </Card>
)

export default Article