---
layout: post
title: "Unity 에서 객체 null 체크 시 주의할 점"
author: SWeetJelly
categories: [ unity ]
image: assets/images/thumbnail.png
toc: true
---

Unity 개발에서 **객체의 null 상태**를 확인하는 것은 매우 중요합니다. C#은 객체의 null 상태를 확인하는 여러 가지 연산자를 제공하지만, Unity에서는 **파괴된 객체**를 메모리에 남아 있는 **파괴 대기 상태**로 처리하기 때문에, Unity 객체의 null 처리는 일반적인 C# 객체와 다르게 동작합니다.

이 글에서는 C#의 **null 관련 연산자**가 어떻게 작동하는지 설명하고, **Unity 객체**에서 발생할 수 있는 주의점, 그리고 이를 보완하기 위한 방법을 설명하겠습니다.

---

## C#에서의 null 연산자

C#에서 null 상태를 확인하거나 처리할 때 사용할 수 있는 몇 가지 주요 연산자가 있습니다.

### 1. **`==` (Equality Operator)와 `!=` (Inequality Operator)**

- **`==` 연산자**는 두 객체가 같은지, 즉 **null**인지 비교하는 데 사용됩니다. 
  ```csharp
  if (myObject == null) { ... }  // myObject가 null인지 확인
  ```

- **`!=` 연산자**는 두 객체가 다른지, 즉 **null이 아닌지** 확인하는 데 사용됩니다.
  ```csharp
  if (myObject != null) { ... }  // myObject가 null이 아닌지 확인
  ```

### 2. **`?.` (Null-Conditional Operator)**
- **`?.` 연산자**는 객체가 **null**일 때 메서드나 속성에 접근하지 않고 안전하게 넘어가도록 합니다.
  ```csharp
  myObject?.SomeMethod();  // myObject가 null이면 SomeMethod 호출하지 않음
  ```

### 3. **`??` (Null-Coalescing Operator)**
- **`??` 연산자**는 객체가 **null**일 때 대체값을 제공하는 방식입니다.
  ```csharp
  myObject = myObject ?? new MyClass();  // myObject가 null이면 새 객체 생성
  ```

### 4. **`??=` (Null-Coalescing Assignment Operator)**
- **`??=` 연산자**는 **null**일 경우에만 값을 할당하고, null이 아닐 때는 기존 값을 유지합니다.
  ```csharp
  myObject ??= new MyClass();  // myObject가 null일 때만 새 객체를 할당
  ```

---

## Unity에서의 null 연산자 동작

Unity는 C#의 **`UnityEngine.Object`** 클래스를 상속받는 객체를 특별하게 처리합니다. Unity에서는 객체가 **파괴**되었을 때 메모리에서 즉시 삭제하지 않고, **파괴 대기 상태**로 남겨두기 때문에 일반적인 **C# null 처리 연산자**가 예상대로 동작하지 않을 수 있습니다.

### Unity의 객체 파괴 대기 상태

Unity에서 객체를 파괴할 때, 객체는 즉시 **null**로 인식되지 않고 여전히 메모리에 참조가 남아 있는 상태가 됩니다. 이 상태에서는 참조가 유효하지만, **파괴된 객체**로 처리됩니다. Unity는 이를 **`==` 연산자**와 **`!=` 연산자**를 오버라이드하여 파괴된 객체를 **null로 인식**하게 만듭니다.

### 1. **`==`와 `!=` in Unity**

Unity는 `Object` 클래스에서 **`==`와 `!=` 연산자**를 오버라이드하여, 객체가 **파괴되었을 때 이를 null로 처리**합니다.

- **`==` 연산자**: 파괴된 객체도 **null**로 인식합니다.
  ```csharp
  if (myUnityObject == null) {
      // 객체가 파괴되었거나 null입니다.
  }
  ```

- **`!=` 연산자**: 파괴된 객체는 **null이 아니라고** 간주되지 않으며, 여전히 참조될 수 있습니다.
  ```csharp
  if (myUnityObject != null) {
      // 객체가 존재하고 파괴되지 않았습니다.
  }
  ```

### 2. **`?.` 연산자 in Unity**

- **`?.` 연산자**는 Unity에서도 **파괴된 객체**를 안전하게 **null로 처리**합니다. 파괴된 객체는 **null로 인식**되어 메서드를 호출하지 않습니다.
  ```csharp
  myUnityObject?.SomeMethod();  // 파괴된 객체에 대해 메서드 호출하지 않음
  ```

### 3. **`??`와 `??=` in Unity**

이 부분이 주의가 필요한 핵심입니다. **null-coalescing 연산자 (`??`와 `??=`)**는 Unity의 **`==` 연산자**처럼 동작하지 않으며, 파괴된 객체를 **null로 인식하지 않습니다**. 이는 Unity 객체가 **파괴되었지만 참조가 남아 있을 때** 예상치 못한 동작을 발생시킬 수 있습니다.

- **`??` 연산자**는 참조가 남아 있는 **파괴된 객체**를 **null로 간주하지 않기 때문에**, 새로 대체값을 할당하지 않습니다.
  ```csharp
  animator = animator ?? new Animator();  // 파괴된 객체가 있어도 새로 생성되지 않음
  ```

- **`??=` 연산자**도 마찬가지로 파괴된 객체를 **null로 간주하지 않기 때문에**, 새로운 값을 할당하지 않습니다.
  ```csharp
  animator ??= GetComponent<Animator>();  // 파괴된 객체가 있지만 null이 아니라고 간주
  ```

이로 인해 **파괴된 객체가 null로 인식되지 않아서**, 새로운 객체를 할당하거나 생성하는 로직이 실행되지 않으며, 예상치 못한 결과를 초래할 수 있습니다.

---

## 결론

Unity에서 **null** 처리를 할 때는, **`== null`과 `?.` 연산자를 사용하는 것이 가장 안전**합니다. **`??`와 `??=` 연산자는 파괴된 Unity 객체를 null로 인식하지 못하므로**, null-coalescing 연산자를 사용하지 않는 편이 좋습니다.
