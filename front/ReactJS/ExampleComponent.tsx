import React, { Component } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { computed } from "mobx";
import QueueLineItem from "./QueueLineItem";
import { TIME_STATUS } from "@app/data/constants";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./queue.less";

interface IProps {
    data?: any[];
    onClick?: (day) => void;
    onTakePause?: (day) => void;
    disablePatientModal?: boolean
}

export default class Queue extends Component<IProps> {
    @computed private get queue() {
        return this.props.data;
    }
    @computed private get line() {
        return this.queue.map(item => {
            const onClick = () => {
                this.onClick(item);
            };
            const onTakePause = () => {
                if (this.props.onTakePause) {
                    this.props.onTakePause(item);
                }
            };
            return (
                <QueueLineItem
                    key={item.id}
                    {...item}
                    onClick={onClick}
                    onTakePause={onTakePause}
                    disablePatientModal={this.props.disablePatientModal}
                />
            );
        });
    }
    public render() {
        return (
            <div className="queue">
                <PerfectScrollbar>
                    <div className="queue__time-line">{this.line}</div>
                </PerfectScrollbar>
            </div>
        );
    }
    private onClick = (item) => {
        this.tryExpand(item);
        if (this.props.onClick) {
            this.props.onClick(item);
        }
    }
    private tryExpand = (item) => {
        const { type } = item;
        if (type === TIME_STATUS.PATIENT) {
            item.expanded = !item.expanded;
        }
    }
}
