import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Loop from '../Loop';
import './LoopList.scss';

const initialState = {
    groupIds: [], 
    selectedLoop: 0
};

class LoopList extends React.Component {
    constructor(props){
        super(props);
        this.state = initialState;
    }

    render() {
        const { groupIds } = this.props;

        return (
            <ListGroup className="o-loop-list">
                {
                groupIds.map((groupId) =>
                <ListGroupItem
                  key={groupId}
                  className="o-loop-list-item">
                    <Loop id={groupId} />
                </ListGroupItem>
                )
                } 
            </ListGroup>
        )
    } 
}

LoopList.propTypes = {
    groupIds: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default LoopList;