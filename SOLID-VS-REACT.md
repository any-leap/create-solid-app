# Solid.js vs React 关键差异指南

## 🎯 概述

从 React 迁移到 Solid.js 时，需要了解的关键差异，帮助避免常见错误。

## 📋 核心差异对比

### 1. JSX 属性语法

#### ❌ React 风格 (错误)
```jsx
// React 中可以这样写，但在 Solid.js 中会出错
<div style="color: red; font-size: 16px">内容</div>
<div style="animation-delay: 0.5s">动画</div>
```

#### ✅ Solid.js 正确写法
```jsx
// Solid.js 中 style 必须是对象
<div style={{ color: "red", "font-size": "16px" }}>内容</div>
<div style={{ "animation-delay": "0.5s" }}>动画</div>

// 或者使用 class
<div class="text-red-500 text-lg">内容</div>
```

### 2. 事件处理

#### ❌ React 风格
```jsx
// React 使用 onClick, onChange 等
<button onClick={handleClick}>点击</button>
<input onChange={handleChange} />
```

#### ✅ Solid.js 正确写法
```jsx
// Solid.js 使用 onclick, onchange (小写)
<button onclick={handleClick}>点击</button>
<input onchange={handleChange} />

// 或者使用 on: 前缀处理自定义事件
<div on:customEvent={handleCustom} />
```

### 3. 条件渲染

#### ❌ React 风格
```jsx
// React 中可以直接使用 && 操作符
{user && <div>欢迎 {user.name}</div>}
{items.length > 0 && <List items={items} />}
```

#### ✅ Solid.js 正确写法
```jsx
// Solid.js 推荐使用 Show 组件
<Show when={user()}>
  <div>欢迎 {user().name}</div>
</Show>

<Show when={items().length > 0}>
  <List items={items()} />
</Show>

// 或者使用函数确保响应性
{() => user() && <div>欢迎 {user().name}</div>}
```

### 4. 列表渲染

#### ❌ React 风格
```jsx
// React 中使用 map
{items.map(item => <Item key={item.id} data={item} />)}
```

#### ✅ Solid.js 正确写法
```jsx
// Solid.js 推荐使用 For 组件获得更好性能
<For each={items()}>
  {(item) => <Item data={item} />}
</For>

// 或者使用 Index 如果需要索引
<Index each={items()}>
  {(item, index) => <Item data={item()} index={index} />}
</Index>
```

### 5. 状态管理

#### ❌ React 风格
```jsx
// React hooks
const [count, setCount] = useState(0);
const [user, setUser] = useState(null);

// 直接使用值
return <div>{count}</div>;
```

#### ✅ Solid.js 正确写法
```jsx
// Solid.js signals
const [count, setCount] = createSignal(0);
const [user, setUser] = createSignal(null);

// 必须调用函数获取值
return <div>{count()}</div>;
```

### 6. 副作用处理

#### ❌ React 风格
```jsx
// React useEffect
useEffect(() => {
  // 副作用逻辑
  return () => {
    // 清理逻辑
  };
}, [dependency]);
```

#### ✅ Solid.js 正确写法
```jsx
// Solid.js createEffect
createEffect(() => {
  // 副作用逻辑 - 自动追踪依赖
  console.log(count());
});

// 清理使用 onCleanup
createEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  
  onCleanup(() => clearInterval(timer));
});
```

### 7. 组件 Props

#### ❌ React 风格 - 解构 Props
```jsx
// React 中可以解构 props
function Component({ title, children }) {
  return <div>{title}{children}</div>;
}
```

#### ✅ Solid.js 正确写法
```jsx
// Solid.js 不要解构 props (会失去响应性)
function Component(props) {
  return <div>{props.title}{props.children}</div>;
}

// 如果需要解构，使用 mergeProps 或 splitProps
function Component(props) {
  const merged = mergeProps({ title: "默认标题" }, props);
  return <div>{merged.title}{merged.children}</div>;
}
```

### 8. 类型定义

#### ❌ React 风格
```tsx
// React 类型
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
```

#### ✅ Solid.js 正确写法
```tsx
// Solid.js 类型
import { JSX } from 'solid-js';

interface Props {
  children: JSX.Element;
  // 或者更具体的类型
  children: JSX.Element | JSX.Element[];
}
```

## 🚨 常见错误和解决方案

### 错误 1: `template2 is not a function`
```jsx
// ❌ 错误原因：字符串样式
<div style="color: red">文本</div>

// ✅ 解决方案：对象样式
<div style={{ color: "red" }}>文本</div>
```

### 错误 2: 响应性丢失
```jsx
// ❌ 错误：解构 props
function Component({ data }) {
  return <div>{data.name}</div>; // 不会响应更新
}

// ✅ 正确：不解构 props
function Component(props) {
  return <div>{props.data.name}</div>; // 保持响应性
}
```

### 错误 3: 事件处理器命名
```jsx
// ❌ 错误：React 风格的事件名
<button onClick={handler}>按钮</button>

// ✅ 正确：Solid.js 风格的事件名
<button onclick={handler}>按钮</button>
```

## 🛠️ ESLint 规则配置

我们的脚手架已经配置了以下 ESLint 规则来帮助检测这些问题：

```json
{
  "rules": {
    "solid/style-prop": "error",           // 检测字符串样式属性
    "solid/no-destructure": "error",      // 禁止解构 props
    "solid/no-react-specific-props": "error", // 检测 React 特有属性
    "solid/reactivity": "error",           // 检测响应性问题
    "solid/jsx-no-undef": "error",        // 检测未定义的 JSX 元素
    "solid/prefer-for": "error"           // 推荐使用 For 组件
  }
}
```

## 📚 最佳实践建议

1. **使用 TypeScript 严格模式**：能够在编译时捕获更多类型错误
2. **配置完整的 ESLint 规则**：自动检测 Solid.js 特有的语法问题
3. **理解响应性原理**：Signals 和 Effects 的工作方式与 React 不同
4. **避免解构 Props**：保持响应性的关键原则
5. **使用专用组件**：`Show`、`For`、`Index` 等获得更好的性能

## 🔗 更多资源

- [Solid.js 官方文档](https://www.solidjs.com/docs/latest)
- [Solid.js vs React 对比](https://www.solidjs.com/guides/comparison)
- [eslint-plugin-solid](https://github.com/solidjs-community/eslint-plugin-solid)

---

通过遵循这些指南，你可以避免大多数从 React 迁移到 Solid.js 时的常见问题！🎉