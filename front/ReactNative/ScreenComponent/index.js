import React from 'react';
import styles from './Styles'
import {
    View,
    StatusBar,
    TouchableOpacity,
    Image,
    Text,
    FlatList
} from 'react-native';

import strings from '@Strings';
import {
    GbSearch,
    GbListItem,
    GbListHeader,
    GbButton,
    GbEmptyState,
    GbLoader,
    GbListLoader
} from '@Components';
import {getDeals, screenHeight, checkForDuplicate} from '@Api';
import {updateNewCallReport, resetNewCallReport} from '@Actions';


import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class CallReportDealSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isFetching: false,
            isRefreshing: false,
            dataFetched: false,
            errorMessage: '',
            error: false,
            searchVal: '',
            checkForDuplicate: false,
            callDate: props.newCallReport.data.callDate,
            entityType: this.props.navigation.getParam('entityType'),
            duplicates: []
        };
        this.timeout = null;
    }
    componentWillMount() {
        const didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            () => {
                this.fetchDeals();
                didFocusSubscription.remove();
            }
        );
    }
    backHandler = async () => {
        const { goBack } = this.props.navigation;
        let {callDate, interactionType, interactionTypePickListDescription } = this.props.newCallReport.data;
        await this.props.resetNewCallReport();
        await this.props.updateNewCallReport({
            callDate,
            interactionType,
            interactionTypePickListDescription
        })
        goBack();
    }
    fetchDeals = () => {
        let { searchVal, entityType } = this.state,
            isSearch = searchVal.length > 0;
        this.setState({
            isFetching: true,
            dataFetched: false,
            isSearch,
            data: []
        });
        return getDeals({
            searchVal,
            entityType
        }).then(data => {
            this.setState({
                data: data.callReportSummarySearch,
                isFetching: false,
                dataFetched: true,
                error: false,
                errorMessage: ''
            });
        }).catch(() => {
            this.setState({
                isFetching: false,
                error: true
            });
        })
    }
    onRefresh = async () => {
        this.setState({
            isRefreshing: true,
        });
        await this.fetchDeals();
        this.setState({
            isRefreshing: false
        });
    }
    onSearch = async (searchVal = '') => {
        let value = searchVal.trim();
        if(value.length < 3 && value.length !== 0) {
            return;
        }
        clearTimeout(this.timeout);
        if(value.length === 0) {
            this.setState({
                searchVal: searchVal
            }, () => {
                this.fetchDeals();
            });
            return;
        }
        let prom = new Promise((resolve) => {
            this.timeout = setTimeout(() => {
                this.setState({
                    searchVal: searchVal
                }, resolve);
            }, 150);
        })
        await prom;
        return this.fetchDeals();
    }
    onDealPress = async entity => {
        let {navigate} = this.props.navigation,
            {callDate, entityType} = this.state,
            duplicatesParams = {},
            usrPrivate = false;
        switch (entityType) {
        case  "G": {
            let clearResponse = this.clearResponse(entity);
            await this.props.updateNewCallReport(clearResponse);
            navigate('CallReportSelectClients');
            return;
        }
        case  "D": {
            duplicatesParams = {
                callDate,
                dealId: entity.id,
                entityType
            }
            break;
        }
        case  "C": {
            switch(entity.entityType) {
            case 'C':
                duplicatesParams = {
                    callDate,
                    clientId: entity.id,
                    entityType: entity.entityType
                }
                break;
            case 'P':
                duplicatesParams = {
                    callDate,
                    prospectId: entity.id,
                    entityType: entity.entityType
                }
                break;
            }
            break;
        }
        default:
            break;
        }
        this.setState({
            checkForDuplicate: true
        });
        let duplicates = await checkForDuplicate(duplicatesParams),
            clearResponse = this.clearResponse(duplicates);
        this.setState({
            checkForDuplicate: false
        });
        if(entityType === 'D') {
            let sysPrivate = duplicates.sysPrivate,
                cfCmType = duplicates.discussionPoints[0].salesProducts.find(item => item.productGroup === '001' || item.productGroup === '002');
            usrPrivate = sysPrivate && !!cfCmType;
            clearResponse.usrPrivate = usrPrivate;
        }
        await this.props.updateNewCallReport(clearResponse);
        if(duplicates.duplicateCallReportDetails !== null && duplicates.duplicateCallReportDetails.length > 0) {
            navigate('DuplicateCallReports', {
                date: callDate,
                list: duplicates.duplicateCallReportDetails
            });
            return;
        }
        navigate('CreateCallReportForm');

    }
    clearResponse = (obj) => {
        const newObj = Object.keys(obj)
            .filter(e => obj[e] !== null && e !== 'id' && e !== 'duplicateCallReportDetails' && e !== 'discussionPoints')
            .reduce((o, e) => {
                o[e] = obj[e]
                return o;
            }, {});

        return newObj;
    }
    get listHeaderText() {
        if (this.state.isSearch) {
            return strings.searchResultsListTitle
        }
        let {
            entityType
        } = this.state;
        switch (entityType) {
        case 'D':
            return strings.dealListTitle
        case 'C':
            return strings.clientListTitle
        case 'G':
            return strings.groupListTitle
        }
    }
    get emptyList() {
        let {error, dataFetched, data} = this.state;
        if(error) {
            return (
                <View style={[styles.fetchFailed, {height: this.errorHeight}]}>
                    <Text style={styles.fetchFailedTitle}>{strings.fetchFailedTitle}</Text>
                    <Text style={styles.fetchFailedText}>{strings.fetchFailedText}</Text>
                    <GbButton
                        style={styles.bottomButtonContainer}
                        title="TRY AGAIN"
                        buttonStyle={[styles.bottomButton, styles.secondaryButton]}
                        labelStyle={[styles.bottomButtonLabelStyle, styles.bottomButtonLabelStyleSecondary]}
                        onPress={this.fetchDeals}
                    />
                </View>
            )
        } else if (dataFetched && data.length === 0) {
            return (
                <GbEmptyState
                    text='No results'
                    style={{height: this.errorHeight}}
                />
            )
        }
        return (
            <GbListLoader />
        )
    }
    get errorHeight() {
        return screenHeight - 164;
    }
    get enableScroll() {
        let {error, isFetching, data} = this.state;
        return (!error && !isFetching) || (isFetching && data.length === 0)
    }
    getListItem = item => {
        let {entityType} = this.state,
            title,
            text;
        switch(entityType){
        case 'D': {
            title = item.entityName;
            text = item.entityId;
            break;
        }
        case 'C': {
            title = item.clientName;
            break;
        }
        case 'G': {
            title = item.entityName;
            break;
        }
        }
        return <GbListItem
            title={title}
            text={text}
            onPress={() => {
                this.onDealPress(item)
            }}
        />
    }
    get pageTitle() {
        let {entityType} = this.state;
        switch(entityType){
        case 'D': {
            return 'Select Deal';
        }
        case 'C': {
            return 'Select Client';
        }
        case 'G': {
            return 'Select Group';
        }
        }
    }
    render() {
        return (
            <View
                style={styles.mainWrapper}
            >
                <StatusBar
                    barStyle="light-content"
                />
                <View style={styles.header}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPressIn={this.backHandler}
                        hitSlop={{top: 16, bottom: 14, left: 16, right: 16}}
                    >
                        <Image
                            style={{
                                width: 16,
                                height: 16
                            }}
                            source={require('@Assets/Images/backButtonWhite.png')}
                        />
                    </TouchableOpacity>
                    <Text
                        style={styles.subHeader}
                    >
                        {this.pageTitle}
                    </Text>
                    <View style={{flex: 0, flexBasis: 18}}></View>
                </View>
                <GbSearch
                    onChangeText={this.onSearch}
                    style={styles.search}
                />
                <FlatList
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={this.enableScroll}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    data={this.state.data}
                    keyExtractor={deal => deal.id}
                    style={styles.listStyle}
                    contentContainerStyle={{backgroundColor: '#ffffff'}}
                    ListHeaderComponent={<GbListHeader label={this.listHeaderText} />}
                    ListFooterComponent={<View style={styles.footer}></View>}
                    ListEmptyComponent={this.emptyList}
                    renderItem={({ item }) => this.getListItem(item)}
                />
                <GbLoader
                    loading={this.state.checkForDuplicate}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        newCallReport: state.newCallReport
    }
};

function mapDispatchToProps(dispatch) {
    return {
        updateNewCallReport: data => dispatch(updateNewCallReport(data)),
        resetNewCallReport: () => dispatch(resetNewCallReport())
    }
}

const ConnectRedux = connect(
    mapStateToProps,
    mapDispatchToProps
)(CallReportDealSearch);

CallReportDealSearch.propTypes = {
    navigation: PropTypes.object,
    newCallReport: PropTypes.object,
    updateNewCallReport: PropTypes.func,
    resetNewCallReport: PropTypes.func
}

export default ConnectRedux;