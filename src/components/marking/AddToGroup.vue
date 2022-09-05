<template>
  <!--真正的自闭组件当是如此，visible为false之后全家消失，丁点不留……-->
  <el-dialog :model-value="true"
             @close="$emit('close')"
             title="请选择要加入的标记分组"
             width="420px">
    <section>
      <div style="margin-bottom: 8px;">
        <el-button size="small" type="success"
                   v-if="!addMode"
                   @click="addMode=true">
          <i class="el-icon-plus">
            新建标记分组
          </i>
        </el-button>
        <el-card v-else>
          <el-form :inline="true" size="small">
            <el-form-item label="分组名">
              <el-input v-model="addTitle"/>
            </el-form-item>
            <el-form-item>
              <el-button circle icon="el-icon-close" type="danger"
                         @click="(addMode=false)||(addTitle='')"></el-button>
              <el-button circle icon="el-icon-check" type="success"
                         @click="addGroup"></el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div>
        <el-checkbox-group
            style="display: flex;flex-direction: column;"
            @change="$emit('update',selected)" v-model="selected">
          <el-checkbox
              style="margin-left:0px"
              v-for="group in groups"
              :key="group.id"
              :label="group.id"
              :value="group.id"
              :disabled="group.checked&&(!canSelectAll)"
          >{{ group.title }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </section>
    <div style="display: flex;justify-content: flex-end;" slot="footer">
      <el-button size="small" type="default"
                 @click="close">取消
      </el-button>
      <el-button size="small" type="primary" @click="saveMarkUp">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  addGroup,
  getGroupsByUsername, getMarkUpGroup,
  markUp,
} from './marks-utils';

let defaultData = {
  groups: [],
  selected: [],
  addMode: false,
  addTitle: '',
};
export default {
  name: 'AddToGroup',
  props: ['target', 'asWho', 'canSelectAll'],
  data() {
    return {...defaultData};
  },
  methods: {
    close() {
      Object.assign(this, defaultData);
      this.$emit('close');
    },
    // 充入数据
    async inflate() {
      // 检查是否有指定的up，如果没有则视作误开
      if (!this.target) return;
      // 需要更新up对操作员
      const [up_groups, {data: {mark_groups: groups}}] = await Promise.all([
        getMarkUpGroup(this.target.mid, this.asWho),
        getGroupsByUsername(this.asWho),
      ]);
      this.selected = up_groups.map(group => group.id);
      for (let group of up_groups) {
        let target = groups.find(x => x.id === group.id);
        if (target) {
          target['checked'] = true;
        }
      }
      this.groups = groups;
    },
    async addGroup() {
      await addGroup({title: this.addTitle, owner_uname: this.asWho});
      this.addMode = false;
      this.addTitle = '';
      await this.inflate();
    },
    async saveMarkUp() {
      let result = await markUp({
        mid: this.target.mid,
        gids: this.selected || [],
        mark_uname: this.asWho,
      });
      this.$emit('close');
    },
  },
  watch: {
    async target(target) {
      return this.inflate();
    },
  },
  mounted() {
    this.inflate();
  },
};
</script>

<style scoped>

</style>
