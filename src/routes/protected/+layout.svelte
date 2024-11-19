<script>
    import { page } from '$app/stores';
    
    $: currentPath = $page.url.pathname;
</script>

<div class="layout">
    <nav>
        <ul>
            <li>
                <a 
                    href="/protected/curriculum"
                    class:active={currentPath === '/protected/curriculum'}
                >
                    Curriculum
                </a>
            </li>
            <li>
                <a 
                    href="/protected/students"
                    class:active={currentPath === '/protected/students'}
                >
                    Students
                </a>
            </li>
            <li>
                <a 
                    href="/protected/grades"
                    class:active={currentPath === '/protected/grades'}
                >
                    Grades
                </a>
            </li>
        </ul>
    </nav>

    <main>
        <slot />
    </main>
</div>

<style>
    .layout {
        display: flex;
        min-height: 100vh;
    }

    nav {
        width: 200px;
        background-color: #f5f5f5;
        padding: 1rem;
    }

    nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    nav li {
        margin-bottom: 0.5rem;
    }

    nav a {
        display: block;
        padding: 0.5rem 1rem;
        color: #333;
        text-decoration: none;
        border-radius: 4px;
    }

    nav a:hover {
        background-color: #e0e0e0;
    }

    nav a.active {
        background-color: #4CAF50;
        color: white;
    }

    main {
        flex: 1;
        padding: 1rem;
    }
</style> 