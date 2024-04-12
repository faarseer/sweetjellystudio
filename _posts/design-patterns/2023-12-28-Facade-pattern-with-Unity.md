---
layout: post
title:  "Facade Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

## Introduction

파사드 패턴은 복잡한 하위 시스템에 대한 단순화된 인터페이스를 제공하는 구조적 디자인 패턴입니다. Unity 에서 게임 개발을 할 때, 이 패턴은 오디오 관리, AI 행동, 여러 사용자 입력 처리와 같은 복잡한 시스템과의 상호작용을 크게 단순화할 수 있습니다. 복잡한 시스템을 하나의 통합된 인터페이스 뒤에 캡슐화함으로써 개발자는 코드를 더 깨끗하고 유지관리하기 쉽게 만들 수 있습니다.

## What is Facade Pattern

파사드 패턴은 복잡한 클래스 또는 라이브러리 집합에 대한 단순화된 인터페이스를 제공하는 것입니다. 복잡한 시스템 상호작용을 구현할 때, 개발자는 종종 수많은 객체를 다루어야 하며, 각 객체는 자체적으로 복잡한 행동과 의존성을 가지고 있습니다. 파사드 패턴은 이러한 시스템에 대한 단일 인터페이스를 제공함으로써 이 복잡성을 관리하고, 하위 시스템의 내부에 대한 의존성을 줄일 수 있다는 것에 있습니다.

## Implementation in Unity

오디오, 그래픽 설정, 입력 관리를 위한 복잡한 상호 작용 시스템이 필요한 간단한 게임 예제를 생각해 봅시다. 게임의 다른 부분에 로직을 펼치는 대신, 모든 이러한 작업을 하나의 파사드 아래에 캡슐화할 수 있습니다.

게임 시스템의 여러 측면을 관리하기 위해 파사드 패턴을 사용해봅시다:

{% highlight csharp %}
using UnityEngine;

// Facade Class
public class GameSystemsFacade
{
    private AudioManager audioManager;
    private GraphicsManager graphicsManager;
    private InputManager inputManager;

    public GameSystemsFacade()
    {
        audioManager = new AudioManager();
        graphicsManager = new GraphicsManager();
        inputManager = new InputManager();
    }

    public void InitializeAllSystems()
    {
        audioManager.Initialize();
        graphicsManager.Initialize();
        inputManager.Initialize();
    }

    public void UpdateAllSystems()
    {
        audioManager.Update();
        graphicsManager.Update();
        inputManager.Update();
    }

    public void ShutdownAllSystems()
    {
        audioManager.Shutdown();
        graphicsManager.Shutdown();
        inputManager.Shutdown();
    }
}

// Example subsystem classes
public class AudioManager
{
    public void Initialize() { Debug.Log("Audio Manager Initialized"); }
    public void Update() { Debug.Log("Audio Manager Updated"); }
    public void Shutdown() { Debug.Log("Audio Manager Shutdown"); }
}

public class GraphicsManager
{
    public void Initialize() { Debug.Log("Graphics Manager Initialized"); }
    public void Update() { Debug.Log("Graphics Manager Updated"); }
    public void Shutdown() { Debug.Log("Graphics Manager Shutdown"); }
}

public class InputManager
{
    public void Initialize() { Debug.Log("Input Manager Initialized"); }
    public void Update() { Debug.Log("Input Manager Updated"); }
    public void Shutdown() { Debug.Log("Input Manager Shutdown"); }
}
{% endhighlight %}

여러 시스템(오디오, 그래픽, 입력) 의 초기화, 업데이트 및 종료를 'GameSystemsFacade' 클래스 내에서 캡슐화 합니다. 이 접근 방식은 이러한 하위 시스템의 관리를 단순화하고 게임 코드의 나머지 부분에 보이는 복잡성 또한 줄여줍니다.

## Conclusion

파사드 패턴을 구현함으로써 개발자는 게임의 주요 기능에 좀 더 집중할 수 있고 개별 하위 시스템의 복잡성에 대해 걱정할 필요가 줄어들어 게임 아키텍처를 깨끗하고 유지 관리하기 쉽게 유지할 수 있습니다.
