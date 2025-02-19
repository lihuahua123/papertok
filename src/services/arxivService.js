import axios from 'axios';

const ARXIV_API = 'https://export.arxiv.org/api/query';

export const fetchPapers = async (start = 0, maxResults = 10) => {
  try {
    const response = await axios.get(ARXIV_API, {
      params: {
        search_query: 'cat:cs.AI',  // 获取AI相关论文
        sortBy: 'submittedDate',
        sortOrder: 'descending',
        start,
        max_results: maxResults
      }
    });

    // Parse XML response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, 'text/xml');
    const entries = xmlDoc.getElementsByTagName('entry');

    return Array.from(entries).map(entry => ({
      id: entry.getElementsByTagName('id')[0]?.textContent,
      title: entry.getElementsByTagName('title')[0]?.textContent.trim(),
      abstract: entry.getElementsByTagName('summary')[0]?.textContent.trim(),
      authors: Array.from(entry.getElementsByTagName('author')).map(
        author => author.getElementsByTagName('name')[0]?.textContent
      ),
      published: entry.getElementsByTagName('published')[0]?.textContent,
      updated: entry.getElementsByTagName('updated')[0]?.textContent,
      link: Array.from(entry.getElementsByTagName('link'))
        .find(link => link.getAttribute('type') === 'text/html')
        ?.getAttribute('href')
    }));
  } catch (error) {
    console.error('Error fetching papers:', error);
    throw error;
  }
}; 