import { KeyframeNode } from "./KeyframeNode";

/**
 * @internal
 * <code>KeyframeNodeList</code> 类用于创建KeyframeNode节点队列。
 */
export class KeyframeNodeList {
	private _nodes: KeyframeNode[] = [];

	/**
	 *	获取节点个数。
	 * @return 节点个数。
	 */
	get count(): number {
		return this._nodes.length;
	}

	/**
	 * 设置节点个数。
	 * @param value 节点个数。
	 */
	set count(value: number) {
		this._nodes.length = value;
	}

	/**
	 * 创建一个 <code>KeyframeNodeList</code> 实例。
	 */
	constructor() {
	}

	/**
	 * 通过索引获取节点。
	 * @param	index 索引。
	 * @return 节点。
	 */
	getNodeByIndex(index: number): KeyframeNode {
		return this._nodes[index];
	}

	/**
	 * 通过索引设置节点。
	 * @param	index 索引。
	 * @param 节点。
	 */
	setNodeByIndex(index: number, node: KeyframeNode): void {
		this._nodes[index] = node;
	}

}

// native
if((window as any).conch  && (window as any).conchKeyframeNodeList){
    //@ts-ignore
    KeyframeNodeList=(window as any).conchKeyframeNodeList;
}
