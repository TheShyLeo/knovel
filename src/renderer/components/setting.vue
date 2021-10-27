<template>
  <el-container class="container">
    <div style="width:600px;">
      <el-form style="width:600px;" ref="form" :model="form" label-width="100px">
        <el-form-item label="小说目录">
          <el-input
            style="width:80.5%;margin-top: 7px;"
            v-model="directory_path"
            size="mini"
            placeholder="请选择小说目录"
            prefix-icon="el-icon-tickets"
          >
            <template slot="prepend">
              <el-checkbox
                :border="true"
                size="mini"
                id="lm"
                v-model="form.errCodeChecked"
                :checked="form.errCodeChecked"
              >乱码</el-checkbox>
            </template>
          </el-input>
          <el-button type="primary" size="mini" @click="openTxt">
            <i class="el-icon-folder-opened"></i>
          </el-button>
        </el-form-item>

        <el-col :span="12">
          <el-form-item label="选择小说">
            <el-select style="width:150px;" v-model="book_id" size="mini" placeholder="请选择" @change="selectOne">
                  <el-option
                    v-for="item in books"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="选择章节">
            <el-select style="width:150px;" v-model="form.index" size="mini" placeholder="请选择"
              clearable filterable :filter-method="filterMethod" v-el-select-loadmore="loadMore(rangeNumber)"
              @visible-change="visibleChange" @change="selectChapter">
                  <el-option
                    v-for="(item,index) in chapter.slice(0, rangeNumber)"
                    :key="index"
                    :label="item.caption"
                    :value="index">
                  </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="当前页数">
            <el-input-number
              size="mini"
              controls-position="right"
              :min="1"
              :max="999999999"
              v-model="form.curr_page"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="每页数量">
            <el-input-number
              size="mini"
              controls-position="right"
              :min="5"
              v-model="form.page_size"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="字体大小">
            <el-input-number
              size="mini"
              controls-position="right"
              :min="12"
              :max="100"
              v-model="form.font_size"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="自动翻页(秒)">
            <el-input-number
              size="mini"
              controls-position="right"
              :min="1"
              :max="60"
              v-model="form.second"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="背景色">
            <el-color-picker v-model="form.bg_color" show-alpha></el-color-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="文字颜色">
            <el-color-picker v-model="form.txt_color" show-alpha></el-color-picker>
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item label="上一页">
            <el-select style="width:138px;" v-model="keyPrevious" size="mini" placeholder="请选择">
              <el-option label="Alt" value="Alt"></el-option>
              <el-option label="Ctrl" value="Ctrl"></el-option>
              <el-option label="Ctrl+Alt" value="Ctrl+Alt"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col style="text-align: center;margin-top: 10px; margin-left: 10px;" :span="2">
          <span>+</span>
        </el-col>

        <el-col :span="10">
          <el-form-item>
            <el-input
              style="width:179px;margin-left: -100px;"
              v-model="keyPreviousX"
              maxlength="100"
              size="mini"
              placeholder="请输入按键"
              prefix-icon="el-icon-grape"
              @focus="onPreviousFocus"
              @blur="onPreviousBlur"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item label="下一页">
            <el-select style="width:138px;" v-model="keyNext" size="mini" placeholder="请选择">
              <el-option label="Alt" value="Alt"></el-option>
              <el-option label="Ctrl" value="Ctrl"></el-option>
              <el-option label="Ctrl+Alt" value="Ctrl+Alt"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col style="text-align: center;margin-top: 10px; margin-left: 10px;" :span="2">
          <span>+</span>
        </el-col>

        <el-col :span="10">
          <el-form-item>
            <el-input
              style="width:179px;margin-left: -100px;"
              v-model="keyNextX"
              maxlength="100"
              size="mini"
              placeholder="请输入按键"
              prefix-icon="el-icon-grape"
              @focus="onNextFocus"
              @blur="onNextBlur"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item label="老板键">
            <el-select style="width:138px;" v-model="keyBoss" size="mini" placeholder="请选择">
              <el-option label="Alt" value="Alt"></el-option>
              <el-option label="Ctrl" value="Ctrl"></el-option>
              <el-option label="Ctrl+Alt" value="Ctrl+Alt"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col style="text-align: center;margin-top: 10px; margin-left: 10px;" :span="2">
          <span>+</span>
        </el-col>

        <el-col :span="10">
          <el-form-item>
            <el-input
              style="width:179px;margin-left: -100px;"
              v-model="keyBossX"
              maxlength="100"
              size="mini"
              placeholder="请输入按键"
              prefix-icon="el-icon-grape"
              @focus="onBossFocus"
              @blur="onBossBlur"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item label="自动翻页">
            <el-select style="width:138px;" v-model="keyAuto" size="mini" placeholder="请选择">
              <el-option label="Alt" value="Alt"></el-option>
              <el-option label="Ctrl" value="Ctrl"></el-option>
              <el-option label="Ctrl+Alt" value="Ctrl+Alt"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col style="text-align: center;margin-top: 10px; margin-left: 10px;" :span="2">
          <span>+</span>
        </el-col>

        <el-col :span="10">
          <el-form-item>
            <el-input
              style="width:179px;margin-left: -100px;"
              v-model="keyAutoX"
              maxlength="100"
              size="mini"
              placeholder="请输入按键"
              prefix-icon="el-icon-grape"
              @focus="onAutoFocus"
              @blur="onAutoBlur"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" style="text-align: center;">
          <el-button style="width: 91%;" type="primary" size="mini" @click="onSubmit">保存</el-button>
        </el-col>
      </el-form>
    </div>
  </el-container>
</template>

<script>
import db from "../../main/utils/db";
import {_debounce} from "../../main/utils/index";
import book from "../../main/utils/book";
import dialog from "../utils/dialog";
import { ipcRenderer, shell, remote } from "electron";
import hotkeys from "hotkeys-js";

export default {
  name: "setting",
  data() {
    return {
      form: {
        path: "",
        curr_page: 1,
        font_size: 16,
        second: 5,
        page_size: 5,
        line_break: " ",
        bg_color: "",
        txt_color: "",
        index: 1,
        errCodeChecked: false,
      },
      rangeNumber: 10,
      key_type: 0,
      book_id: "",
      books: [{id:'nothing',name:'请选择TXT目录!'}],
      chapter: [],
      directory_path: "",
      keyPrevious: "Ctrl+Alt",
      keyPreviousX: "",
      keyNext: "Ctrl+Alt",
      keyNextX: "",
      keyBoss: "Ctrl+Alt",
      keyBossX: "",
      keyAuto: "Ctrl+Alt",
      keyAutoX: ""
    };
  },
  created() {
    this.onLoad();
    this.onKey();
  },
  methods: {
    openUrl() {
      shell.openExternal("https://www.baidu.com");
    },
    selectOne() {
      let book_info = db.getBookById(this.book_id);
      if(book_info){
        this.form = book_info;
      }
      let t1 = new Date().getTime();
      let res = book.refresh(this.book_id);
      if(res.code === 0){
        this.chapter = res.data;
      }
      let t2 = new Date().getTime();
      console.log(t2-t1)
    },    
    selectChapter() {
      if(this.form.index>=0){
        let position = this.chapter[this.form.index].position;
        this.form.curr_page = Math.floor(position/this.form.page_size);
      }
    },
    loadMore(n) {
      // n是默认初始展示的条数会在渲染的时候就可以获取,具体可以打log查看
      // elementui下拉超过7条才会出滚动条,如果初始不出滚动条无法触发loadMore方法
      return () => (this.rangeNumber += 5); // 每次滚动到底部可以新增条数  可自定义
    },
        // 筛选方法
    filterMethod:_debounce(function(filterVal){
      if(filterVal){
        let filterArr = this.chapter.filter((item)=>{
          return item.caption.includes(filterVal)
        })
        this.chapter = filterArr;
      }
    },500),
    // 下拉框出现时，调用过滤方法
    visibleChange(flag){
      if(flag){
        this.filterMethod()
      }
    },
    onPreviousFocus() {
      this.keyPreviousX = "";
      this.key_type = 1;
    },
    onNextFocus() {
      this.keyNextX = "";
      this.key_type = 2;
    },
    onBossFocus() {
      this.keyBossX = "";
      this.key_type = 3;
    },
    onAutoFocus() {
      this.keyAutoX = "";
      this.key_type = 4;
    },
    onPreviousBlur() {
      this.key_type = 0;
    },
    onNextBlur() {
      this.key_type = 0;
    },
    onBossBlur() {
      this.key_type = 0;
    },
    onAutoBlur() {
      this.key_type = 0;
    },
    onKey() {
      var that = this;

      hotkeys.filter = function(event) {
        return true;
      };

      hotkeys("*", function(e) {
        if (
          e.key != "Control" &&
          e.key != "Meta" &&
          e.key != "Alt" &&
          e.key != "Shift" &&
          e.key != "Backspace" &&
          e.key != "CapsLock" &&
          e.key != "Enter" &&
          e.key != "Tab" &&
          e.key != "Escape" &&
          e.key != "Numlock" &&
          e.key != "F5"
        ) {
          var keyx = "";
          if (e.key === "ArrowLeft") {
            keyx = "Left";
          } else if (e.key === "ArrowUp") {
            keyx = "Up";
          } else if (e.key === "ArrowDown") {
            keyx = "Down";
          } else if (e.key === "ArrowRight") {
            keyx = "Right";
          }else if (e.key.trim() === "") {
            keyx = "不能为空格,请删掉重新输入";
          }

          if (that.key_type == 1) {
            if (keyx != "") {
              that.keyPreviousX = keyx;
            }
          } else if (that.key_type == 2) {
            if (keyx != "") {
              that.keyNextX = keyx;
            }
          } else if (that.key_type == 3) {
            if (keyx != "") {
              that.keyBossX = keyx;
            }
          } else if (that.key_type == 4) {
            if (keyx != "") {
              that.keyAutoX = keyx;
            }
          }
        }
      });
    },
    onLoad() {
      this.book_id = db.get("book_id");
      let books = db.get("books");
      if(books.length>0){
        this.books = books;
      }
      this.directory_path = db.get("current_directory");
      let book_info = db.getBookById(this.book_id);
      if(book_info){
        this.form = book_info;
      }
      this.chapter = remote.getGlobal("chapter");
      this.rangeNumber = this.form.index?this.form.index+5 : 10;

      var key_previous = db.get("key_previous");
      var arr = key_previous.split("+");
      if (arr.length === 2) {
        this.keyPrevious = arr[0];
        this.keyPreviousX = arr[1];
      } else if (arr.length === 3) {
        this.keyPrevious = arr[0] + "+" + arr[1];
        this.keyPreviousX = arr[2];
      }

      var key_next = db.get("key_next");
      var arr = key_next.split("+");
      if (arr.length === 2) {
        this.keyNext = arr[0];
        this.keyNextX = arr[1];
      } else if (arr.length === 3) {
        this.keyNext = arr[0] + "+" + arr[1];
        this.keyNextX = arr[2];
      }

      var key_boss = db.get("key_boss");
      var arr = key_boss.split("+");
      if (arr.length === 2) {
        this.keyBoss = arr[0];
        this.keyBossX = arr[1];
      } else if (arr.length === 3) {
        this.keyBoss = arr[0] + "+" + arr[1];
        this.keyBossX = arr[2];
      }

      var key_auto = db.get("key_auto");
      var arr = key_auto.split("+");
      if (arr.length === 2) {
        this.keyAuto = arr[0];
        this.keyAutoX = arr[1];
      } else if (arr.length === 3) {
        this.keyAuto = arr[0] + "+" + arr[1];
        this.keyAutoX = arr[2];
      }

    },
    openTxt() {
      var that = this;
      dialog.showOpenDirectory(function(e) {
        that.directory_path = e[0];
      });
    },
    onSubmit() {
      var key_previous = this.keyPrevious + "+" + this.keyPreviousX;
      db.set("key_previous", key_previous);

      var key_next = this.keyNext + "+" + this.keyNextX;
      db.set("key_next", key_next);

      var key_boss = this.keyBoss + "+" + this.keyBossX;
      db.set("key_boss", key_boss);

      var key_auto = this.keyAuto + "+" + this.keyAutoX;
      db.set("key_auto", key_auto);

      let cur_book = db.getBookById(this.book_id);
      if(this.book_id!=='nothing' && cur_book){
        db.set("book_id", this.book_id);//当前txt
        this.form.id = this.book_id;
        this.form.name = cur_book.name;
        this.form.path = cur_book.path;
        console.log(this.form);
        db.updateBookById(this.form);
      }
      ipcRenderer.send("bg_text_color", this.form);

      this.$message({
        message: "保存成功,ヽ(￣▽￣)ﾉ",
        type: "success",
        showClose: true
      });
    }
  },
  directives:{
  'el-select-loadmore':(el, binding) => {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector(".el-select-dropdown .el-select-dropdown__wrap");
    if(SELECTWRAP_DOM){
      SELECTWRAP_DOM.addEventListener("scroll", function () {
        /**
         * scrollHeight 获取元素内容高度(只读)
         * scrollTop 获取或者设置元素的偏移值,
         *  常用于:计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
         * clientHeight 读取元素的可见高度(只读)
         * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
         * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
         */
        const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
        if (condition) binding.value();
      });
    }
  }
}
};
</script>

<style scoped lang="scss">
.container {
  margin: 10px;

  .rightx {
    width: 185px;
    text-align: center;
    line-height: 8px;

    .toolx {
      height: 390px;

      .nbx {
        writing-mode: vertical-rl;
        font-size: 14px;
        letter-spacing: 6px;
        margin-left: 0px;
        background: #585858;
        padding: 7px 80px 7px 80px;
        margin-top: -7px;
        color: #ffffff;
        border-radius: 8px;
        font-size: 12px;
      }
    }

    .sizex {
      font-size: 18px;
      line-height: 35px;
      font-weight: bold;
    }

    .cteamx {
      background: #38393a;
      line-height: 24px;
      color: #fff;
      font-size: 12px;
      cursor: pointer;
    }
  }
}

.el-input-number--mini {
  width: 111px;
  line-height: 26px;
}

.el-checkbox__input {
  cursor: pointer;
  outline: 0;
  line-height: 1;
  vertical-align: middle;
  margin-right: -7px;
}

#lm {
  margin-left: -17px;
  margin-right: -17px;
  .el-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 12px;
  }
}

.el-checkbox.is-bordered.el-checkbox--mini {
  height: 26px;
  border: 0px;
}

.el-checkbox.is-bordered.is-checked {
  border: 0px;
}

.el-form-item__content {
  margin-left: 0px;
}
</style>
