import * as React from 'react';
import { List } from 'antd';
import Table from 'antd/es/table';
import axios from 'axios';

export interface TableState {
    posts: IPosts[];
    comments: IPosts[];
    currentId: number;
}

export interface IPosts {
    id: number;
    user_id: number;
    title: string;
    body: string;
    name: string;
    email: string;
    _links: any;
    self: any;
}

export default class TableComponents extends React.Component<{}, TableState> {
    constructor(props: any) {
        super(props);
        this.state = {
            posts: [],
            comments: [],
            currentId: NaN,
        };
    }


    componentDidMount(): void {
        axios.get('https://gorest.co.in/public-api/posts?_format=json&access-token=5jI-GQS5tDv1usjvKRzSOfR5VzWg6XtfH2ml')
            .then(res => {
                this.setState({ posts: res.data.result })
            })
            .catch(e => {
                console.log(e);
            });

        axios.get('https://gorest.co.in/public-api/comments?_format=json&access-token=5jI-GQS5tDv1usjvKRzSOfR5VzWg6XtfH2ml')
            .then(res => {
                this.setState({ comments: res.data.result })
            })
            .catch(e => {
                console.log(e);
            });
    }

    getColumns = () => {
        return [
            {
                title: 'User_ID',
                dataIndex: 'user_id',
            },
            {
                title: 'Title',
                dataIndex: 'title',
            },
            {
                title: 'Body',
                dataIndex: 'body',
            },
            {
                title: 'Links',
                key: 'links',
                render: (record: any) => <a href={ record.links }>Show Post</a>,
            },
        ];
    };


    getPosts = () => {
        return this.state.posts.map(item => {
            return {
                key: item.id,
                user_id: item.user_id,
                title: item.title,
                body: item.body,
                links: `${item._links.self.href}?access-token=5jI-GQS5tDv1usjvKRzSOfR5VzWg6XtfH2ml`,
            }
        });
    };

    selectRow = (e: React.MouseEvent) => {
        const getRow = (e.target as HTMLElement).parentElement!;
        const id = getRow.getAttribute('data-row-key')!;
        this.setState({ currentId: +id })
    };


    render() {
        return(
            <>
                <div className='table-block'>
                    <Table
                        columns={this.getColumns()}
                        dataSource={this.getPosts()}
                        onRow={() => ({ onClick: this.selectRow})}
                    />
                </div>

                <div className='list-block'>
                    <List
                        dataSource={this.state.comments.filter(item => item.id == this.state.currentId)}
                        renderItem={item => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    title={item.name}
                                    description={item.email}
                                />
                                <div>{item.body}</div>
                            </List.Item>
                        )}
                    >
                    </List>
                </div>
            </>
        );
    }
}