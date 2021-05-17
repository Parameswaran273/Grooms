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
            if (name == "Completeorder") {
                this.setState({
                    InfoTitle: "Completed Orders (This Month)",
                    InfoDetails: <div><p></p>
                        <ul>
                            <li>Current Month Completed Orders for both Netbuild and CORE.</li>
                        </ul>
                    </div>
                });
            }
            else if (name == "CycleTime") {
                this.setState({
                    InfoTitle: "Cycle Time",
                    InfoDetails: <div><p></p>
                        <ul>
                            <li>Average Cycle Time of both Netbuild and CORE Completed Orders for Current Month (Values calculated based on Business Days).</li>
                        </ul>
                    </div>
                });
            }
            else if (name == "MadeSla") {
                this.setState({
                    InfoTitle: "% Made SLA",
                    InfoDetails: <div><p></p>
                        <ul>
                            <li>Shows the Percent of Completed orders for the current month, when order cycle time meet the predicted target.</li>
                        </ul>
                    </div>
                });
            }
            else if (name == "OccdMade") {
                this.setState({
                    InfoTitle: "OCCD Met",
                    InfoDetails: <div><p></p>
                        <ul>
                            <li>Shows the number of Completed orders and percentage made SLA for the current month, when order cycle time meet the OCCD.</li>
                        </ul>
                    </div>
                });
            }
            else if (name == "MadeSLAPredicted") {
                this.setState({
                    InfoTitle: "% Made SLA based on Prediceted Target",
                    InfoDetails: <div>
                        <ul>
                            <li>Shows the number of Completed orders by SLA made and SLA Missed, Percent of Completed orders for the past 7 months when order cycle time meet the predicted target.</li>
                        </ul>
                    </div>
                });
            }
            else if (name == "MadeSLAOCCD/RCCD") {
                this.setState({
                    InfoTitle: "% Made SLA based on OCCD/RCCD",
                    InfoDetails: <div>
                        <ul>
                            <li>Shows the number of Completed orders by SLA made and SLA Missed, Percent of Completed orders for the past 7 months when order cycle time meet the (OCCDorRCCD for Netbuild and OCCD for CORE orders).</li>
                        </ul>
                    </div>
                });
            }
            else if (name == "MonthlyThr") {
                this.setState({
                    InfoTitle: "Monthly Throughput",
                    InfoDetails: <div><p></p>
                        <ul>
                            <li>Shows number of orders Completed in past 7 months with Average Cycle Time.</li>
                        </ul>
                    </div>
                });
            }
            else if (name == "DailyThr") {
                this.setState({
                    InfoTitle: "Daily Throughput",
                    InfoDetails: <div><p></p>
                        <ul>
                            <li>Shows the number of Daily Completed orders for 7 days with Average Cycle Time.</li>
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

