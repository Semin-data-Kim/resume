document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyze-btn');
  const statusDiv = document.getElementById('status');

  // 버튼이 존재하는지 먼저 확인 (에러 방지)
  if (!analyzeBtn) {
    console.error("에러: 'analyze-btn'을 찾을 수 없습니다. HTML의 ID를 확인하세요.");
    return;
  }

  analyzeBtn.addEventListener('click', async () => {
    statusDiv.innerText = "분석 중입니다. 잠시만 기다려주세요...";
    analyzeBtn.disabled = true;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // 1. 공고 데이터 텍스트 추출
      const scriptResult = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const hostname = location.hostname;
          const getMeta = (selector) => {
            const el = document.querySelector(selector);
            return el?.getAttribute('content')?.trim() || '';
          };

          const rawTitle = document.title || '';
          const metaTitle =
            getMeta('meta[property="og:title"]') ||
            getMeta('meta[name="title"]');
          const metaCompany =
            getMeta('meta[property="og:site_name"]') ||
            getMeta('meta[name="company"]') ||
            getMeta('meta[name="author"]');

          const extractFromJsonLd = () => {
            const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
            for (const script of scripts) {
              try {
                const json = JSON.parse(script.textContent || '');
                const items = Array.isArray(json) ? json : [json];
                for (const item of items) {
                  if (item && item['@type'] === 'JobPosting') {
                    return {
                      title: item.title || '',
                      company: item.hiringOrganization?.name || '',
                    };
                  }
                }
              } catch {
                // ignore invalid JSON-LD blocks
              }
            }
            return { title: '', company: '' };
          };

          const getTitleFromDom = () => {
            const selectors = [
              '.job-details-jobs-unified-top-card__job-title h1',
              '.jobs-unified-top-card__job-title h1',
              'h1[data-testid="job-title"]',
              'h1[class*="JobHeader"]',
              'h1',
            ];
            for (const selector of selectors) {
              const el = document.querySelector(selector);
              const text = el?.textContent?.trim();
              if (text) return text;
            }
            return '';
          };

          const jsonLd = extractFromJsonLd();
          const fallbackTitle = getTitleFromDom();

          const title = (jsonLd.title || metaTitle || fallbackTitle || rawTitle)
            .replace(/\s+/g, ' ')
            .trim();
          const parts = title.split('|').map((item) => item.trim()).filter(Boolean);

          let companyName = '';
          if (parts.length > 1) {
            companyName = parts[0].replace(/\s*채용.*$/i, '').trim();
          } else if (title.includes(' - ')) {
            companyName = title.split(' - ')[0].replace(/\s*채용.*$/i, '').trim();
          }
          if (!companyName) {
            const linkedInCompany =
              document.querySelector('.job-details-jobs-unified-top-card__company-name')?.textContent?.trim() ||
              document.querySelector('.jobs-unified-top-card__company-name')?.textContent?.trim() ||
              '';
            companyName = jsonLd.company || metaCompany;
            if (!companyName) {
              companyName = linkedInCompany;
            }
          }

          let jobTitle = '';
          if (parts.length > 1) {
            jobTitle = parts.slice(1).join(' | ').trim();
          } else if (title.includes(' - ')) {
            jobTitle = title.split(' - ')[1]?.trim() || '';
          }
          if (!jobTitle) {
            jobTitle = title;
          }

          return {
            text: document.body.innerText,
            title: jobTitle,
            companyName,
            url: location.href,
            hostname,
          };
        },
      });
      
      const jobPosting = scriptResult[0].result;
      const hostname = (jobPosting.hostname || '').toLowerCase();
      const isWanted = hostname.includes('wanted.co.kr');
      const isRemember = hostname.includes('rememberapp.co.kr') || hostname.includes('rememberapp.com');
      const isLinkedIn = hostname.includes('linkedin.com');
      const isJobKorea = hostname.includes('jobkorea.co.kr');
      const isSaramin = hostname.includes('saramin.co.kr');

      if (isJobKorea || isSaramin) {
        throw new Error('현재 지원하지 않는 채용 사이트입니다.');
      }

      if (!isWanted && !isRemember && !isLinkedIn) {
        throw new Error('채용 공고 페이지에서만 분석할 수 있습니다.');
      }

      // 2. 서버 호출 (credentials 포함하여 로그인 세션 전달)
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobPostingText: jobPosting.text,
          jobTitle: jobPosting.title,
          companyName: jobPosting.companyName,
          jobPostingUrl: jobPosting.url,
        }),
        credentials: 'include' 
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const result = await response.json();
      statusDiv.innerText = "분석 완료! 리포트를 엽니다.";
      
      // 3. 리포트 페이지 새 탭 오픈
      const reportId = result.reportId;
      window.open(`http://localhost:3000/reports?reportId=${encodeURIComponent(reportId)}`, '_blank');

    } catch (error) {
      console.error("클라이언트 오류:", error);
      statusDiv.innerText = "오류: " + error.message;
    } finally {
      analyzeBtn.disabled = false;
    }
  });
});
