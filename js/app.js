(function (window,Vue,undefined) {
	var list = [{ id: 3, content: "hhaha", isFinish: true }, { id: 1, content: "hehehe", isFinish: false }, { id:2, content: "eeeeeee", isFinish: true }];
	var vm = new Vue({
		el: "#app",
		data: {
			// 没有后台数据，所以获取的数据需要从window.ocalstorage中取，
			// 从localstorage中取出的数据是json字符串的形式，所以要使用json.parse转换成数组
			list: JSON.parse(window.localStorage.getItem("list")) || [],
			content:"",
			beforVal:{},
			hashVal:1,
			// 定义一个新数组，用来接收按钮切换后的值
			showList:[]
		},
		methods:{
			// 添加一条数据
			handleAdd(){
				//设置添加数据的id，获取数组的最后一个元素的id值
				if(!this.content.trim()){
					return ;
				}
				var newId =this.list.length ? this.list[this.list.length - 1]['id']+1 : 1;
				// // 向数组的头部添加数据
				this.list.push({
					content: this.content,
					isFinish: false,
					// 给数组的最后一项的id值加1，就是新添加数据的id值
					id: newId
				});
				this.content="";
			},
			// 删除一条数据
			handleDel(index){
				// 根据数据的id值删除
				if(confirm("确定要删除所选的数据吗？")){
					this.list.splice(index, 1);
				}	
			},
			// 删除多条数据
			handleDelAll(){
				this.list = this.list.filter(item=>{
					return !item.isFinish
				})
			},
			// 显示选中样式
			showEdit(index){
				this.$refs.show.forEach((item)=>{
					item.classList.remove("editing");
				})
				this.$refs.show[index].classList.add('editing');
				// 当此时的数据为列表数据时，可以使用下面的方法进行深拷贝
				// 将数组格式的数据转成json字符串的形式，再将json字符串形式的数据转成json数组的形式
				// 这样就可以实现深拷贝
				this.beforVal = JSON.parse(JSON.stringify(this.list[index]));
			},
			// 实现编辑事件
			handleEdit(index){
				// 如果输入框中的内容为空，就删除该数据
				if(!this.list[index].content.trim()){
					this.list.splice(index,1);
				}
				// 当已完成的数据被编辑后应该变成未完成的数据
				if(this.beforVal !== this.list[index]){
					this.list[index].isFinish = false;
				}
				// 点击回车后编辑框的样式消失
				this.$refs.show[index].classList.remove('editing');
				// 清空备份
				this.beforVal = {};
			},
			// 实现撤销编辑后还原原来的数据
			handleBack(index){
				this.list[index].content = this.beforVal.content;
				// 点击esc键后编辑框的样式消失
				this.$refs.show[index].classList.remove('editing');
				// 清空备份
				this.beforVal = {};
			},
			hashChange(){
				switch (window.location.hash) {
					case "":
					case "#/":
						this.showAll();
						this.hashVal = 1;
						break;
					case "#/active":
						this.showActive(false);
						this.hashVal = 2;
						break;
					case "#/completed":
						this.showActive(true);
						this.hashVal = 3;
						break;
				}
			},
			// 显示所有
			showAll(){
				// 将数组中的每一项都设置为true，并绑定到v-show中，这样就可以确保每一项都可以显示
				this.showList = this.list.map(()=>true);
			},
			showActive(flag){
				this.showList = this.list.map(item=>item.isFinish===flag)
				var msg = this.list.every(item=>
					item.isFinish===!flag
				)
				// console.log(msg);
				if (msg) {
					return window.location.hash = "#/";
				}
			}
		},
		// 计算属性
		computed:{
			//  使用计算属性计算页面中未完成数据的个数
			unfinish(){
				return this.list.filter((item)=>{
					return !item.isFinish
				}).length
			},
			// 使用计算属性，设置全选反选按钮
			selectAll:{
				get(){
					return this.list.every(item=>{
						return item.isFinish
					})
				},
				set(val){
					this.list.forEach(item=>{
						item.isFinish = val
					})
				}
			}
		},
		// 自定义指令
		directives: {
			focus: {
				inserted(el) {
					el.focus();
				}
			}
		},
		// 使用监听属性向window.localStorage中存储数据
		watch: {
			list: {
				handler(newV) {
					window.localStorage.setItem("list", JSON.stringify(newV));
					this.hashChange();
				},
				deep: true
			}
		},
		// 使用生命周期,在页面中的{{}}插值表达式执行之前执行该属性
		created(){
			this.hashChange();
			// 使用onhashchange()方法
			window.onhashchange=()=>{
				this.hashChange();
			}
		}
	});

})(window, Vue);
