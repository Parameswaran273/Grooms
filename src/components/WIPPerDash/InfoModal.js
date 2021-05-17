import React, { Component } from 'react';
import { Modal } from 'antd';

class InfoModal extends Component {
    constructor(props) {
        super(props);
        this.toggleInfoModal = this.toggleInfoModal.bind(this);
        this.state = {
            InfoModal: false
        };
    }

    componentDidMount() {
        this.props.setClick1(this.toggleInfoModal);
    }
    toggleInfoModal(name) {
        if (this.state.InfoModal == true) {
            this.setState({
                InfoModal: false
            });
        }
        else {
            this.setState({
                InfoModal: true
            });
            if (name == "WIPAging") {
                this.setState({
                    InfoTitle: "WIP Aging",
                    InfoDetails: <div><p></p>
                        <ul>
                            <li>WIP orders correspond to the current aging of orders for each performance buckets (0 to 50Days, 51 to 75 Days, 76 to 100 Days, and Above 100 Business days).</li>
                        </ul>
                    </div>
                });
            }
            if (name == "DailyTrending") {
                this.setState({
                    InfoTitle: "WIP Daily Trending",
                    InfoDetails: <div><p></p>
                        <ul>
                            <li>Shows the number of in-progress orders on daily basis.</li>
                        </ul>
                    </div>
                });
            }
            if (name == "MonthlyTrending") {
                this.setState({
                    InfoTitle: "WIP Monthly Trending",
                    InfoDetails: <div><p></p>
                        <ul>
                            <li>Shows the number of in-progress orders on monthly basis.</li>
                        </ul>
                    </div>
                });
            }
        }
    }

    render() {
        return (
            <div>
                <Modal footer={null} title={this.state.InfoTitle} className="Intervaltimeline" visible={this.state.InfoModal} onCancel={this.toggleInfoModal}>
                    {this.state.InfoDetails}
                </Modal>
            </div>
        );
    }
}

export default InfoModal;

