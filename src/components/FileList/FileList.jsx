/**
 *
 *  Copyright 2018 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dimmer, Loader, Table, Button, Dropdown, Divider } from 'semantic-ui-react'

const styles = {
    resultTable: {
        marginTop: 75,
    },
}

const profileOptions = {
    perf: {
        text: 'Open as Linux Perf',
        value: 'perf'
    },
    nflxprofile: {
        text: 'Open as Netflix Profile',
        value: 'nflxprofile'
    },
    trace_event: {
        text: 'Open as Trace Event',
        value: 'trace_event'
    },
    cpuprofile: {
        text: 'Open as Chrome CPU Profile',
        value: 'cpuprofile'
    },
}

class FileList extends Component {
    constructor(props) {
        super(props);

        this.state = {
          files: [],
          loading: false,
        };
    }

    componentDidMount() {
        this.setState({loading: true})
        fetch('/profile/')
            .then(res => {
                return res.json()
            })
            .then(data => {
                this.setState({files: data, loading: false})
            })
    }

    handleHeatmapClick(type, path) {
        this.props.history.push(`/heatmap/${type}/${path}`)
    }

    handleSpeedScope(path) {
      window.open(`${process.env.SPEEDSCOPE_URL}/#profileURL=${process.env.SPEEDSCOPE_URL}/${process.env.STATIC_PROFILES_PATH}/${path}`, '_blank')
    }

    render() {
        const self = this
        
        return (
            <div style={styles.container}>
                <Dimmer page inverted active={this.state.loading}>
                    <Loader size='massive' inverted>Loading</Loader>
                </Dimmer>
                <Table celled={true} style={styles.resultTable}>
                    <Table.Header>
                    <Table.Row textAlign='center'>
                        <Table.HeaderCell>Profile</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.HeaderCell>SpeedScope</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {this.state.files.sort().map(function(file) {
                        const filename = file.filename
                        const type = file.type == 'unknown' ? 'perf' : file.type

                        const path = encodeURIComponent(filename)
                        return (
                            <Table.Row key={filename}>
                                <Table.Cell>{filename}</Table.Cell>
                                <Table.Cell textAlign='center'>
                                <Button.Group color='teal'>
                                    <Button onClick={() => {self.handleHeatmapClick(type, path)}}>{type in profileOptions ? profileOptions[type].text : `Open as ${type}`}</Button>
                                    <Dropdown floating button className='icon'>
                                        <Dropdown.Menu>
                                            {Object.keys(profileOptions).map(key => {
                                                return (
                                                    key != type ? <Dropdown.Item key={key} onClick={() => {self.handleHeatmapClick(key, path)}}>{profileOptions[key].text}</Dropdown.Item> : null
                                                )
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Button.Group>
                                </Table.Cell>
                                <Table.Cell textAlign='center'>
                                <Button.Group color='teal'>
                                    <Button onClick={() => {self.handleSpeedScope(path)}}>Open in SpeedScope</Button>
                                </Button.Group>
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}
                    </Table.Body>
                </Table>
                <Divider hidden clearing />
            </div>
        )
    }
}

FileList.propTypes = {
    history: PropTypes.object.isRequired,
}

export default FileList
