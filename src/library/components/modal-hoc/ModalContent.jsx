import React, {Component, Fragment} from 'react';
import {Button, Spin} from 'antd';
import PropTypes from "prop-types";
import {getElementTop, getParentByClassName} from '@/library/utils';

/**
 * Modal 的内容容器，默认会使用屏幕剩余空间，内部内容滚动
 */
export default class ModalContent extends Component {
    state = {
        height: 'auto',
    };

    static propTypes = {
        surplusSpace: PropTypes.bool,   // 是否使用屏幕剩余空间
        loading: PropTypes.bool,        // 是否加载中
        otherHeight: PropTypes.number,  // 除了主体内容之外的其他高度，用于计算主体高度；
        footer: PropTypes.any,          // 底部
        okText: PropTypes.any,          // 确定按钮文案
        cancelText: PropTypes.any,      // 取消按钮文案
        onOk: PropTypes.func,           // 确定事件
        onCancel: PropTypes.func,       // 取消事件
    };

    static defaultProps = {
        surplusSpace: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => void 0,
        onCancel: () => void 0,
    };

    componentDidMount() {
        const {surplusSpace} = this.props;

        if (surplusSpace) {
            this.handleWindowResize();
            window.addEventListener('resize', this.handleWindowResize);
        }


    }

    componentWillUnmount() {
        const {surplusSpace} = this.props;

        if (surplusSpace) window.removeEventListener('resize', this.handleWindowResize)
    }

    handleWindowResize = () => {
        let {otherHeight} = this.props;
        const windowHeight = document.documentElement.clientHeight;
        if (!otherHeight) {
            const top = getElementTop(this.wrapper);
            let bottom = 24;
            const antModalDom = getParentByClassName(this.wrapper, 'ant-modal');

            if (antModalDom) {
                const classList = Array.from(antModalDom.classList);
                const isFullScreen = classList.find(item => item.startsWith('full-screen'));

                if (isFullScreen) bottom = 0;
            }

            otherHeight = top + bottom;
        }
        const height = windowHeight - otherHeight;

        this.setState({height});
    };

    render() {
        const {
            surplusSpace,
            loading = false,
            otherHeight,
            style = {},
            footer,
            okText,
            cancelText,
            onOk,
            onCancel,
            children,
            ...others
        } = this.props;
        const {height} = this.state;
        return (
            <Spin spinning={loading}>
                <div
                    className="modal-content"
                    ref={node => this.wrapper = node}
                    style={{display: 'flex', flexDirection: 'column', height, ...style}}
                    {...others}
                >
                    <div style={{flex: 1, overflow: surplusSpace ? 'auto' : ''}}>
                        {children}
                    </div>
                    {footer !== false ? (
                        <div className="ant-modal-footer" style={{flex: 0}}>
                            {footer ? footer : (
                                <Fragment>
                                    <Button type="primary" onClick={onOk}>{okText}</Button>
                                    <Button type="default" onClick={onCancel}>{cancelText}</Button>
                                </Fragment>
                            )}
                        </div>
                    ) : null}
                </div>
            </Spin>
        );
    }
}
