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
            if (name == "OrdersOnRisk") {
                this.setState({
                    InfoTitle: "Orders at Risk",
                    InfoDetails: <div><p></p>
                        <ul>
                            <li>WIP Orders predicted to exceed the prediction order target.</li>
                        </ul>
                    </div>
                });
            }
            else if (name == "OrdersNotOnRisk") {
                this.setState({
                    InfoTitle: "Orders Not at Risk",
                    InfoDetails: <div><p></p>
                        <ul>
                            <li>WIP Orders not predicted to exceed the prediction order target.</li>
                        </ul>
                    </div>
                });
            }
            //else if (name == "WIPPhase") {
            //    this.setState({
            //        InfoTitle: "WIP Phase Performance",
            //        InfoDetails: <div>
            //            <ul>
            //                <li>Orders that have open tasks, within the present phase with Actual Aging and ML Yield Target at different Order Configuration.
            //                    <ul style={{ listStyleType: "circle"}}> 
            //                        <li>Note:
            //                             <ul style={{ listStyleType: "square" }}>
            //                                <li>Order Configuration: SourceSystem | OrderClassType | IMPPOS2 | is3rdPartyColoneeded | ProjectType | CreatorGroup | CategoryCD | OrderType</li>
            //                            </ul>
            //                        </li>
            //                    </ul>
            //                </li>
            //            </ul>
            //        </div>
            //    });
            //}
            else if (name == "TaskProfile") {
                this.setState({
                    InfoTitle: "WIP Task Profile(ML Target)",
                    InfoDetails: <div><p></p>
                        <ul>
                            <li>WIP tasks are shown based on the Directors Level and each workgroup System-level rollup, having orders which are going to meet or missed the historical learned target.</li>
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

