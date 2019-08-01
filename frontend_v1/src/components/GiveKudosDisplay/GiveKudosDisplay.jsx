import React from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { isEmpty } from 'lodash'; 
import * as kudosActions from '../../containers/kudos/availableKudos/actions';
import Kudos from '../Kudos';
import TextArea from '../form-controls/TextArea';
import BasicButton from '../BasicButton/BasicButton';

class GiveKudosDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKudoId: 0,
      kudosNote: "",
      kudosReturned: false
    }
  }
  
  componentDidMount = async () => {
    try {
      const kudosList = await this.props.dispatchGetAvailableKudos();
    } catch(error) {
      this.setState({ error: 'Your kudos were unable to load at this time. Please check back later.' })
    }
    this.setState({ kudosReturned: true })
  }

  componentWillUnmount() {
    this.props.dispatchClearAvailableKudos();
  }

  onSelectKudo = (id) => {
    this.setState({
      selectedKudoId: id,
    })
  }

  onChange = (event) => {
    this.setState({ kudosNote: event });
  }
  
  onCancelKudos = () => {
    this.props.onCancel();
  }
  
  giveKudos = () => {
    const { selectedKudoId, kudosNote } = this.state;
    if(selectedKudoId === 0 || kudosNote === "") {
      return;
    }

    this.props.onGiveKudos(this.state.selectedKudoId, this.state.kudosNote);
    this.onCancelKudos();
  }
  
  render() {
    const { availableKudos } = this.props;

    if (!this.state.kudosReturned)
    return ('Loading...');

    if (this.state.kudosReturned && isEmpty(availableKudos))
    return ('No available kudos.');

    if(!isEmpty(this.state.error))
    return this.state.error;

    return (
      <span>
        <Row>
          {Object.keys(availableKudos).map(kudo => 
            <Col md="4" key={kudo}>
              <Kudos id={kudo} onSelect={this.onSelectKudo}/>
            </Col>
          )}
        </Row>
      <div>
        Selected: {this.state.selectedKudoId}
      </div>

      <TextArea
        className="o-kudos-note"
        placeholder="Add a note"
        value={this.state.kudosNote}
        onChange={this.onChange}
        />

        <BasicButton onClick={this.onCancelKudos} color="secondary">Cancel</BasicButton>
        <BasicButton onClick={this.giveKudos}>Send</BasicButton>
      </span>
    );

  }
}
    

GiveKudosDisplay.propTypes = {
  onGiveKudos: PropTypes.func,
  onCancel: PropTypes.func
}

const mapStateToProps = (state) => {
  const { availableKudos } = state;
  
  return { availableKudos };
}

const mapDispatchToProps = (dispatch) => ({
  dispatchGetAvailableKudos: () => dispatch(kudosActions.getAvailableKudos()), 
  dispatchClearAvailableKudos: () => dispatch(kudosActions.clearAvailableKudos())
})

export default connect(mapStateToProps, mapDispatchToProps)(GiveKudosDisplay);
