/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/views/home/index.tsx
 */

import { useState } from 'react';
import { InputGroup, Input, Notification, toaster } from 'rsuite';
import { Search } from '@rsuite/icons';
import axios from 'axios';
import useAckee from 'use-ackee';

import { AppHead, AppFooter } from 'components';

function Index() {
	const [keyword, setkeyword] = useState('');
	const [result, setresult] = useState<any>();

	useAckee(
		'/',
		{
			server: '//tongji.zmide.com',
			domainId: 'ae768a4b-3b79-4bc9-b2d8-b14b6c4e20ee',
		},
		{
			detailed: false,
			ignoreLocalhost: true,
			ignoreOwnVisits: true,
		}
	);

	const onSearch = () => {
		setresult(undefined);

		if (keyword.length === 0) {
			toaster.push(<Notification type="warning" header={'你还没说要查啥题目呢！'} closable />, {
				placement: 'topEnd',
			});
			return;
		}

		axios
			.get('//tool.chaoxing.zmorg.cn/api/search.php?q=' + keyword)
			.then((res: any) => {
				const { msg } = res?.data;
				if (msg?.answer && msg?.question) {
					setresult(msg);
				} else {
					// toaster.clear();
					toaster.push(<Notification type="warning" header={msg} closable />, {
						placement: 'topEnd',
					});
				}
				// console.log('成功', res);
			})
			.catch((e) => {
				// console.log('搜题失败', e);
				// toaster.clear();
				toaster.push(<Notification type="error" header={e + ''} closable />, {
					placement: 'topEnd',
				});
			});
	};

	return (
		<div className="container">
			<AppHead />
			<div className="context">
				<div className="search_box">
					<InputGroup size="lg">
						<Input
							placeholder={'让我看看你遇到什么样的难题了。'}
							onChange={(value: any) => setkeyword(value)}
							onKeyUp={(e) => {
								if (e.key.match('Enter')) {
									// 响应回车点击事件，立即搜索
									onSearch();
								}
							}}
						/>
						<InputGroup.Button onClick={() => onSearch()}>
							<Search />
						</InputGroup.Button>
					</InputGroup>

					{result && (
						<div className="search_result">
							<div className="item">
								<h3 className="problem">{result?.question}</h3>
								<p className="answer">{result?.answer}</p>
							</div>
						</div>
					)}
				</div>
			</div>
			<AppFooter />
		</div>
	);
}

export default Index;
