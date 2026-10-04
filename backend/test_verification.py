import asyncio
import os
import httpx

async def test_all():
    # Yerel test şifresi — asla commit edilen gerçek üretim şifresi olmasın.
    # Dev varsayılan hash için boş bırakılabilir; özel kurulumda ADMIN_TEST_PASSWORD ver.
    admin_password = os.environ.get("ADMIN_TEST_PASSWORD", "admin123")

    async with httpx.AsyncClient(base_url='http://127.0.0.1:8000') as client:
        # 1. Public list test
        r = await client.get('/api/projects')
        assert r.status_code == 200, f'Public get status: {r.status_code}'
        projects = r.json()
        print('1. Public projects count:', len(projects))
        assert 'has_readme' in projects[0]
        assert 'readme_markdown' not in projects[0] or projects[0].get('readme_markdown') is None
        print('   Public projection has_readme check: PASS')

        # 2. Public detail test
        slug = projects[0]['slug']
        r = await client.get(f'/api/projects/{slug}')
        assert r.status_code == 200
        detail = r.json()
        print(f"2. Public detail for {slug}: status 200, has_readme: {detail.get('has_readme')}")

        # 3. Auth guard on admin endpoints (Expect 401 without cookie)
        r = await client.get('/api/admin/projects')
        assert r.status_code == 401, f'Expected 401, got {r.status_code}'
        print('3. Admin auth guard test: PASS (got 401 Unauthorized)')

        # 4. Admin login
        r = await client.post('/api/admin/auth/login', json={'password': 'wrongpassword'})
        assert r.status_code == 401
        
        r = await client.post('/api/admin/auth/login', json={'password': admin_password})
        assert r.status_code == 200, (
            f'Login failed ({r.status_code}). '
            'Dev hash için varsayılan şifre veya ADMIN_TEST_PASSWORD kullan.'
        )
        cookies = r.cookies
        csrf = cookies.get('admin_csrf')
        assert csrf, 'CSRF cookie missing after login'
        admin_headers = {'X-CSRF-Token': csrf}
        print('4. Admin login with correct password: PASS')

        # 5. Large 300 KB content test
        large_markdown = '# 300KB Test\n\n' + ('Bu bir uzun paragraftır ve test için tekrarlanmaktadır. ' * 6500)
        char_count = len(large_markdown)
        print(f'5. Testing 300 KB content save (characters: {char_count})...')

        new_proj_payload = {
            'slug': 'test-300kb-project',
            'repo_name': 'test-repo',
            'title_tr': 'Test 300KB Projesi',
            'category': 'software-algo',
            'github_url': 'https://github.com/omerabali/test-repo',
            'is_published': False,
            'readme_markdown': large_markdown
        }
        r = await client.post('/api/admin/projects', json=new_proj_payload, cookies=cookies, headers=admin_headers)
        assert r.status_code == 201, f'Create project failed: {r.status_code}, {r.text}'
        created = r.json()
        created_id = created['id']
        assert len(created['readme_markdown']) == char_count, f'Truncation error! {len(created["readme_markdown"])} vs {char_count}'
        print(f'   Saved character count exact match: {len(created["readme_markdown"])} == {char_count} (PASS)')

        # Read back via detail
        r = await client.get('/api/admin/projects', cookies=cookies)
        p_in_admin = next(p for p in r.json() if p['id'] == created_id)
        assert len(p_in_admin['readme_markdown']) == char_count
        print('   Read back from DB exact length match: PASS')

        # Clean up test project
        r = await client.delete(f'/api/admin/projects/{created_id}', cookies=cookies, headers=admin_headers)
        assert r.status_code == 200
        print('   Test project cleaned up: PASS')

if __name__ == '__main__':
    asyncio.run(test_all())
