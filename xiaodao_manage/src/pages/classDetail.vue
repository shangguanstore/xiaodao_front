<template>
  <div class="class_detail_container">
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>教务中心</BreadcrumbItem>
        <BreadcrumbItem>班级管理</BreadcrumbItem>
        <BreadcrumbItem>班级详情</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="container detail_info mt20">
      <p class="content_title">班级信息</p>
      <Row :gutter="60" class="mt20">
        <Col span="6">
          <p class="item">
            <span>班级名称：</span>
            <span>测试课程1班</span>
          </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>班级容量：</span>
          <span>20</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>班级老师：</span>
          <span>曹老师</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>在读人数：</span>
          <span>1</span>
        </p>
        </Col>
      </Row>
      <Row :gutter="60" class="mt20">
        <Col span="6">
        <p class="item">
          <span>上课教室：</span>
          <span>未分配</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>备注信息：</span>
          <span>无</span>
        </p>
        </Col>
      </Row>

    </div>

    <div class="container mt20">
      <Tabs value="name1">
        <TabPane label="排课信息" name="name1">
          <div class="mt20">
            <Button type="info" icon="ios-plus-empty" @click="addCourse">一键排课</Button>
            <Button type="default" class="ml20">批量修改</Button>
            <Button type="default" class="ml20">批量删除</Button>
          </div>

          <Table border ref="selection" :loading="loading" @on-selection-change="checkNum" :columns="courseTableColumns"
                 :data="tableData" class="mt20">>
          </Table>
        </TabPane>
        <TabPane label="班级学员" name="name2">
          <div class="mt20">
            <Button type="info" icon="ios-plus-empty" @click="addCourse">添加学员</Button>
            <Button type="default" class="ml20">调至其他班</Button>
            <Button type="default" class="ml20">移出本班</Button>
          </div>

          <Table border ref="selection" :loading="loading" @on-selection-change="checkNum" :columns="studentTableColumns"
                 :data="tableData" class="mt20">>
          </Table>

        </TabPane>
        <TabPane label="点名情况" name="name3">标签三的内容</TabPane>
      </Tabs>
    </div>

    <Modal
      v-model="showCourseSchedulBox"
      width:="480"
      :styles="{top: '100px'}"
    >
      <p slot="header">
        <span>排课</span>
      </p>

      <div>
        <div class="tabBar float-wrap mb10 ml10">
          <div class="item fl" :class="courseTabBar == 0 ? 'active' : ''"
               @click="changeCourseTabBar(0)">规则排课
          </div>
          <div class="item fl" :class="courseTabBar == 1 ? 'active' : ''"
               @click="changeCourseTabBar(1)">日历排课
          </div>
        </div>

        <Form v-if="courseTabBar == 0" ref="courseFormValidate" :model="courseFormValidate" :rules="courseRuleValidate" :label-width="80">
          <FormItem label="开始日期" prop="start_date">
            <DatePicker v-model="courseFormValidate.start_date" type="date" format="yyyy-MM-dd" placeholder="选择开始日期" style="width: 200px"></DatePicker>
          </FormItem>

          <Row :gutter="10">
            <Col span="10">
            <FormItem label="结束方式" prop="end_type">
              <Select v-model="courseFormValidate.end_type" @on-change="changeEndType" style="width: 100%">
                <Option v-for="item in endTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>

            <Col span="8">
            <FormItem v-if="courseFormValidate.end_type == 1" prop="end_date" :label-width="10">
              <DatePicker v-model="courseFormValidate.end_date" type="date" format="yyyy-MM-dd" placeholder="选择日期" style="width: 1.3rem"></DatePicker>
            </FormItem>

            <FormItem v-if="courseFormValidate.end_type == 2" prop="end_count" :label-width="10"  style="position: relative;">
              <Input v-model="courseFormValidate.end_count"
                     placeholder="" style="width: 1.3rem"></Input>
              <span class="fieldUnit" style="right: -.37rem;">次之后</span>
            </FormItem>
            </Col>
          </Row>

          <FormItem label="是否重复" prop="repetition_type">
            <Select v-model="courseFormValidate.repetition_type" @on-change="changeEndType" style="width: 200px">
              <Option v-for="item in repetitionTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="周几上课">
            <div class="tabBar float-wrap mb10 ml10" style="line-height: 100%;">
              <div class="item fl active" style="padding: 10px;">一
              </div>
              <div class="item fl" style="padding: 10px">二
              </div>
              <div class="item fl" style="padding: 10px">三
              </div>
              <div class="item fl" style="padding: 10px">四
              </div>
              <div class="item fl" style="padding: 10px">五
              </div>
              <div class="item fl" style="padding: 10px">六
              </div>
              <div class="item fl" style="padding: 10px">日
              </div>

            </div>
          </FormItem>

          <FormItem label="上课时间" prop="end_type">
            <Select v-model="courseFormValidate.course_time" @on-change="changeEndType" style="width: 200px">
              <Option v-for="item in courseTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="授课老师" prop="end_type">
            <Select v-model="courseFormValidate.course_time" @on-change="changeEndType" style="width: 200px">
              <Option v-for="item in courseTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="学管师" prop="end_type">
            <Select v-model="courseFormValidate.course_time" @on-change="changeEndType" style="width: 200px">
              <Option v-for="item in courseTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="上课教室" prop="end_type">
            <Select v-model="courseFormValidate.course_time" @on-change="changeEndType" style="width: 200px">
              <Option v-for="item in courseTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>


          <FormItem label="上课内容" prop="comment">
          <Input v-model="courseFormValidate.comment" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="最多20字" style="width:calc(100% - 60px);"></Input>
          </FormItem>

        </Form>

        <Form v-if="courseTabBar == 1" ref="courseFormValidate" :model="courseFormValidate" :rules="courseRuleValidate" :label-width="80">
          <FormItem label="上课日期" prop="start_date">
            <DatePicker v-model="courseFormValidate.start_date" type="date" format="yyyy-MM-dd" placeholder="选择开始日期" style="width: 200px"></DatePicker>
          </FormItem>

          <FormItem label="上课时间" prop="end_type">
            <Select v-model="courseFormValidate.course_time" @on-change="changeEndType" style="width: 200px">
              <Option v-for="item in courseTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="授课老师" prop="end_type">
            <Select v-model="courseFormValidate.course_time" @on-change="changeEndType" style="width: 200px">
              <Option v-for="item in courseTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="学管师" prop="end_type">
            <Select v-model="courseFormValidate.course_time" @on-change="changeEndType" style="width: 200px">
              <Option v-for="item in courseTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="上课教室" prop="end_type">
            <Select v-model="courseFormValidate.course_time" @on-change="changeEndType" style="width: 200px">
              <Option v-for="item in courseTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="上课内容" prop="comment">
            <Input v-model="courseFormValidate.comment" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="最多20字" style="width:calc(100% - 60px);"></Input>
          </FormItem>

        </Form>
      </div>

      <div slot="footer">
        <Button type="default" @click="handleCourseCancel" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="handleCourseSubmit('courseFormValidate')">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'classDetail',
    data() {
      return {
        showCourseSchedulBox: false,
        courseTabBar: 0,
        loading: false,
        tableData: [],
        endTypeList: [
          {
            value: 1,
            label: '限日期'
          },
          {
            value: 2,
            label: '限次数'
          },
        ],
        repetitionTypeList: [
          {
            value: 1,
            label: '每周'
          },
          {
            value: 2,
            label: '隔周'
          },
        ],
        courseTimeList: [
          {
            value: 1,
            label: '08:00~09:00'
          },
        ],

        checkNums: 0,
        sels: [],

        courseFormValidate: {
          start_date: '',
          end_date: '',
          end_type: '',
          end_count: 1,
          repetition_type: 1,
          course_time: '',
        },
        courseRuleValidate: {},

        courseTableColumns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '排课方式',
              key: '排课方式'
            },
            {
              title: '上课日期',
              key: '上课日期'
            },
            {
              title: '上课时间',
              key: '上课时间'
            },
            {
              title: '上课教室',
              key: '上课教室',
            },
            {
              title: '上课老师',
              key: '上课老师'
            },
          {
            title: '上课内容',
            key: '上课内容'
          },
            {
              title: '创建日期',
              key: 'create_time_format'
            },
            {
              title: '操作',
              key: 'operation',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small',
                    },
                    style: {
                      color: '#2db7f5'
                    },
                    on: {
                      click: () => {
                        this.update(params)
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small',
                    },
                    style: {
                      color: '#2db7f5'
                    },
                    on: {
                      click: () => {
                        this.remove(params)
                      }
                    }
                  }, '删除'),
                ])
              }
            }
          ],

        studentTableColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            key: '姓名'
          },
          {
            title: '性别',
            key: '性别'
          },
          {
            title: '手机号',
            key: '手机号'
          },
          {
            title: '课程名',
            key: '课程名',
          },
          {
            title: '操作',
            key: 'operation',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  style: {
                    color: '#2db7f5'
                  },
                  on: {
                    click: () => {
                      this.update(params)
                    }
                  }
                }, '调至其他班'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  style: {
                    color: '#2db7f5'
                  },
                  on: {
                    click: () => {
                      this.remove(params)
                    }
                  }
                }, '移出本班'),
              ])
            }
          }
        ],
      }
    },
    created() {
    },
    mounted() {

    },
    methods: {
      addCourse() {
        this.showCourseSchedulBox = true
      },
      changeCourseTabBar(tab) {
        this.courseTabBar = tab
      },
      checkNum(selection) {
        this.checkNums = selection.length
        this.sels = selection
      },
      changeEndType() {
        console.log('end-type',this.courseFormValidate.end_type)

      },
      handleCourseCancel() {

      },
      handleCourseSubmit() {

      },
    },
  }
</script>
<style>

</style>
